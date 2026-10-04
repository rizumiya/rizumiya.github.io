import requests
import json
import os
from datetime import datetime, timezone, timedelta
from youtube_transcript_api import YouTubeTranscriptApi
from google import genai
from google.genai import types

# Setup Gemini API client
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set.")
    exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = 'gemini-2.5-flash'

SHEET_URL = "https://script.google.com/macros/s/AKfycby4VII6l6bhOcss0IXRwxCXdoyIpWcS9hMmM5niOm50DL1PZdU-cSvAsQ1b7LOpgc2I/exec"

def extract_video_id(url):
    """Extracts the video ID from a YouTube URL."""
    if "youtube.com/watch?v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    return None

def get_youtube_transcript(url):
    """Fetches the transcript of a YouTube video."""
    if not url:
        return ""
    video_id = extract_video_id(url)
    if not video_id:
        return ""

    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['id', 'en'])
        transcript_text = " ".join([t['text'] for t in transcript_list])
        return transcript_text
    except Exception as e:
        print(f"Failed to get transcript: {e}")
        return ""

def generate_content(prompt):
    """Generates content using Gemini API."""
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Failed to generate content: {e}")
        return ""

def generate_hexo_frontmatter(title, date_str, tags_list, categories_list):
    """Generates Hexo frontmatter."""
    tags_str = "\n".join([f"  - {tag.strip()}" for tag in tags_list])
    categories_str = "\n".join([f"  - {cat.strip()}" for cat in categories_list])

    frontmatter = f"""---
title: "{title}"
date: {date_str}
tags:
{tags_str}
categories:
{categories_str}
---

"""
    return frontmatter

def fetch_data():
    """Fetches data from the Google Apps Script endpoint."""
    try:
        response = requests.get(SHEET_URL)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Failed to fetch data from endpoint: {e}")
        return None

def main():
    data = fetch_data()
    if not data:
        print("Error: Could not retrieve data.")
        return

    # Use today's date in WIB timezone (UTC+7)
    tz_wib = timezone(timedelta(hours=7))
    now = datetime.now(tz_wib)
    date_str = now.strftime('%Y-%m-%d %H:%M:%S')

    content = ""
    frontmatter = ""
    slug = ""

    if data.get("status") == "success" and data.get("count", 0) > 0 and data.get("data"):
        # We have data for today
        post_data = data["data"][0]

        topik = post_data.get("topik", "")
        teks_utama = post_data.get("teksUtama", "")
        link_referensi = post_data.get("linkReferensi", "")
        prompt_pemanis = post_data.get("promptPemanis", "")
        kategori_str = post_data.get("kategori", "")
        slug = post_data.get("slug", f"post-{now.strftime('%Y%m%d%H%M%S')}")

        print(f"Found scheduled task for topic: {topik}")

        transcript = ""
        if link_referensi:
            print("Extracting YouTube transcript...")
            transcript = get_youtube_transcript(link_referensi)

        prompt = f"""Saya sedang menulis artikel blog. Topiknya adalah: {topik}.
Berikut adalah materi kasarnya: {teks_utama}. """

        if transcript:
            prompt += f"\n\nBerikut adalah referensi tambahannya (transkrip video): {transcript}."

        prompt += f"\n\nTolong buatkan artikel berformat Markdown untuk Hexo (hanya isinya saja tanpa frontmatter). Instruksi tambahan: {prompt_pemanis}."

        print("Generating content with Gemini...")
        content = generate_content(prompt)

        categories = [c.strip() for c in kategori_str.split(",") if c.strip()]
        if not categories:
            categories = ["Uncategorized"]

        # Parse tags from categories or generate some generic ones
        tags = categories.copy()

        frontmatter = generate_hexo_frontmatter(topik, date_str, tags, categories)

    else:
        # No data from endpoint, generate a trending post
        print("No scheduled task found. Generating a viral topic post...")
        slug = f"viral-topic-{now.strftime('%Y%m%d')}"

        prompt = """Tolong buatkan satu artikel blog yang menarik dan panjang (berformat Markdown tanpa frontmatter) tentang sebuah topik yang saat ini sedang viral atau trending di Indonesia (misalnya tentang teknologi, AI, gaya hidup, atau hiburan).
Selain artikel, berikan juga metadata di baris paling awal sebelum artikel, dengan format JSON seperti ini, dibungkus blok kode json:
```json
{
  "title": "Judul Artikel",
  "categories": ["Kategori 1", "Kategori 2"],
  "tags": ["Tag 1", "Tag 2"],
  "slug": "slug-url-artikel"
}
```
Pastikan artikelnya bergaya santai, informatif, dan relevan dengan audiens Indonesia."""

        print("Generating content with Gemini...")
        response_text = generate_content(prompt)

        # Extract JSON metadata
        metadata = None
        if "```json" in response_text:
            try:
                json_part = response_text.split("```json")[1].split("```")[0].strip()
                metadata = json.loads(json_part)
                # Remove the JSON block from the content
                content = response_text.split("```")[2].strip()
            except Exception as e:
                print(f"Failed to parse metadata JSON: {e}")

        if not metadata:
             content = response_text
             metadata = {
                 "title": "Topik Viral Hari Ini",
                 "categories": ["Berita"],
                 "tags": ["Viral"],
                 "slug": slug
             }

        slug = metadata.get("slug", slug)
        title = metadata.get("title", "Topik Viral Hari Ini")
        categories = metadata.get("categories", ["Berita"])
        tags = metadata.get("tags", ["Viral"])

        frontmatter = generate_hexo_frontmatter(title, date_str, tags, categories)

    if not content:
        print("Failed to generate content. Exiting.")
        return

    # Clean up content if AI added frontmatter manually
    if content.startswith("---"):
        parts = content.split("---")
        if len(parts) >= 3:
            content = "---".join(parts[2:]).strip()

    final_markdown = frontmatter + content

    # Save to source/_posts
    # Hexo typical structure has source/_posts, but this repo only has output folders.
    # We will place it in source/_posts so next Hexo generate picks it up.
    os.makedirs("source/_posts", exist_ok=True)

    filepath = f"source/_posts/{slug}.md"

    # Ensure unique filename
    counter = 1
    original_filepath = filepath
    while os.path.exists(filepath):
        filepath = f"source/_posts/{slug}-{counter}.md"
        counter += 1

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(final_markdown)

    print(f"Successfully generated post: {filepath}")

if __name__ == "__main__":
    main()
