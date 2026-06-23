#!/usr/bin/env python3
"""
Solfianza i18n Build Script
Generates multilingual pages from French source HTML + JSON translation files.

Usage:
  python3 scripts/build-i18n.py              # build all languages
  python3 scripts/build-i18n.py --lang en    # build English only
  python3 scripts/build-i18n.py --page index # build index.html for all langs
"""

import json
import os
import re
import sys
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
I18N_DIR = ROOT / 'i18n'

LANGS = ['en', 'de', 'es', 'it', 'nl', 'pl', 'sv']

BASE_URL = 'https://solfianza.eu'

# Pages to process: source filename → page key in i18n JSON
PAGES = {
    'index.html': 'index',
    'pret-personnel.html': 'pret-personnel',
    'credit-auto.html': 'credit-auto',
    'credit-moto.html': 'credit-moto',
    'credit-travaux.html': 'credit-travaux',
    'credit-renouvelable.html': 'credit-renouvelable',
    'rachat-de-credits.html': 'rachat-de-credits',
    'assurances.html': 'assurances',
    'nous-decouvrir.html': 'nous-decouvrir',
    'nous-contacter.html': 'nous-contacter',
}

# Ordered list for hreflang (most important pages first)
ALL_LANGS = ['fr'] + LANGS


def load_i18n(lang):
    path = I18N_DIR / f'{lang}.json'
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def fix_asset_urls(html, depth=1):
    """Prefix relative asset/link hrefs with ../ for subdirectory pages."""
    prefix = '../' * depth

    # Fix CSS, JS, favicon links (href/src that don't start with http, //, #, data:, ../)
    def fix_attr(m):
        attr, val = m.group(1), m.group(2)
        if val.startswith(('http', '//', '#', 'data:', '../', 'mailto:')):
            return m.group(0)
        return f'{attr}="{prefix}{val}"'

    # src attributes (images, scripts)
    html = re.sub(r'(src)="([^"]+)"', fix_attr, html)
    # href attributes (css, favicon, preload, canonical, alternate)
    html = re.sub(r'(href)="([^"#][^"]*\.(css|js|svg|jpg|jpeg|png|gif|webp|woff2|woff|ttf))"',
                  fix_attr, html)
    # preload as= links
    html = re.sub(r'(<link[^>]+as="(?:image|style|font)"[^>]+href=")([^"]+)(")',
                  lambda m: m.group(0) if m.group(2).startswith(('http', '//', '../', 'data:'))
                  else m.group(1) + prefix + m.group(2) + m.group(3),
                  html)

    # Fix internal page links (href="page.html" → href="../page.html")
    def fix_page_link(m):
        val = m.group(1)
        if val.startswith(('http', '//', '#', 'data:', '../', 'mailto:', 'javascript:')):
            return m.group(0)
        # Only fix .html links
        if val.endswith('.html') or '/' not in val:
            return f'href="{prefix}{val}"'
        return m.group(0)

    html = re.sub(r'href="([^"]+)"', fix_page_link, html)
    return html


def add_hreflang(html, page_filename, current_lang):
    """Insert hreflang link tags into <head>."""
    hreflang_tags = []

    # French (root)
    fr_url = f'{BASE_URL}/{page_filename}'
    hreflang_tags.append(f'  <link rel="alternate" hreflang="fr" href="{fr_url}">')

    # Other languages
    for lang in LANGS:
        url = f'{BASE_URL}/{lang}/{page_filename}'
        hreflang_tags.append(f'  <link rel="alternate" hreflang="{lang}" href="{url}">')

    # x-default (points to French)
    hreflang_tags.append(f'  <link rel="alternate" hreflang="x-default" href="{fr_url}">')

    # Canonical for this page
    if current_lang == 'fr':
        canonical_url = f'{BASE_URL}/{page_filename}'
    else:
        canonical_url = f'{BASE_URL}/{current_lang}/{page_filename}'
    hreflang_tags.append(f'  <link rel="canonical" href="{canonical_url}">')

    hreflang_block = '\n'.join(hreflang_tags)

    # Insert before </head>
    html = html.replace('</head>', f'{hreflang_block}\n</head>', 1)
    return html


def apply_translations(html, fr_data, target_data):
    """Replace French strings with target language strings."""
    fr_strings = fr_data['strings']
    target_strings = target_data['strings']

    for key, fr_text in fr_strings.items():
        if key not in target_strings:
            continue
        target_text = target_strings[key]
        if fr_text == target_text:
            continue
        # Simple string replacement
        if fr_text in html:
            html = html.replace(fr_text, target_text)

    return html


def update_lang_attr(html, lang):
    """Update <html lang="..."> attribute."""
    return re.sub(r'<html([^>]*) lang="[^"]*"', f'<html\\1 lang="{lang}"', html)


def update_meta_tags(html, page_key, target_data):
    """Replace <title> and <meta name="description"> with translated versions."""
    pages = target_data.get('pages', {})
    if page_key not in pages:
        return html

    page_meta = pages[page_key]

    # Replace title
    if 'title' in page_meta:
        html = re.sub(r'<title>[^<]*</title>',
                      f'<title>{page_meta["title"]}</title>', html)

    # Replace meta description
    if 'description' in page_meta:
        html = re.sub(r'<meta name="description" content="[^"]*"',
                      f'<meta name="description" content="{page_meta["description"]}"', html)

    return html


def inject_lang_switcher(html, current_lang, page_filename, fr_data):
    """Inject language switcher into the desktop nav and mobile menu."""
    lang_names = {
        'fr': '🇫🇷 Français',
        'en': '🇬🇧 English',
        'de': '🇩🇪 Deutsch',
        'es': '🇪🇸 Español',
        'it': '🇮🇹 Italiano',
        'nl': '🇳🇱 Nederlands',
        'pl': '🇵🇱 Polski',
        'sv': '🇸🇪 Svenska',
    }

    def lang_url(lang, page):
        if lang == 'fr':
            if current_lang == 'fr':
                return page
            else:
                return f'../{page}'
        else:
            if current_lang == 'fr':
                return f'{lang}/{page}'
            elif current_lang == lang:
                return page
            else:
                return f'../{lang}/{page}'

    options_html = ''
    for lang, name in lang_names.items():
        url = lang_url(lang, page_filename)
        selected = ' aria-current="true"' if lang == current_lang else ''
        options_html += f'<a href="{url}" class="lang-opt{" lang-opt--active" if lang == current_lang else ""}"{selected}>{name}</a>\n'

    switcher_html = f'''
    <div class="lang-switcher" id="lang-switcher" role="navigation" aria-label="Language selection">
      <button class="lang-switcher-btn" id="lang-switcher-btn" aria-haspopup="true" aria-expanded="false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="lang-current">{lang_names[current_lang]}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l4 4 4-4"/></svg>
      </button>
      <div class="lang-dropdown" id="lang-dropdown" role="menu">
        {options_html}
      </div>
    </div>'''

    # Inject before </div></header> (after hd-right div)
    html = html.replace('  </div>\n\n</header>', f'  {switcher_html}\n  </div>\n\n</header>', 1)
    return html


def build_page(source_file, lang, fr_data, target_data, output_dir):
    """Build a single translated page."""
    source_path = ROOT / source_file
    if not source_path.exists():
        print(f'  [SKIP] {source_file} not found')
        return

    with open(source_path, 'r', encoding='utf-8') as f:
        html = f.read()

    page_key = PAGES[source_file]

    # 1. Apply string translations
    html = apply_translations(html, fr_data, target_data)

    # 2. Update lang attribute
    html = update_lang_attr(html, target_data['lang'])

    # 3. Update meta title + description
    html = update_meta_tags(html, page_key, target_data)

    # 4. Fix asset and internal URLs (depth=1 for language subdirectory)
    html = fix_asset_urls(html, depth=1)

    # 5. Add hreflang + canonical
    html = add_hreflang(html, source_file, lang)

    # 6. Inject language switcher
    html = inject_lang_switcher(html, lang, source_file, fr_data)

    # Write output
    output_path = output_dir / source_file
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'  ✓ {output_dir.name}/{source_file}')


def update_french_pages(fr_data):
    """Add hreflang + lang switcher to the French source pages."""
    for source_file, page_key in PAGES.items():
        source_path = ROOT / source_file
        if not source_path.exists():
            continue

        with open(source_path, 'r', encoding='utf-8') as f:
            html = f.read()

        # Remove existing hreflang/canonical we may have added before
        html = re.sub(r'\s*<link rel="alternate"[^>]+>\n?', '', html)
        html = re.sub(r'\s*<link rel="canonical"[^>]+>\n?', '', html)

        # Remove existing lang switcher if present
        html = re.sub(r'\s*<div class="lang-switcher".*?</div>\s*</div>', '',
                      html, flags=re.DOTALL)

        # Add hreflang
        html = add_hreflang(html, source_file, 'fr')

        # Add lang switcher
        html = inject_lang_switcher(html, 'fr', source_file, fr_data)

        with open(source_path, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f'  ✓ (FR) {source_file}')


def build_sitemap():
    """Generate a multilingual sitemap.xml."""
    urls = []

    for source_file in PAGES:
        url_block = '  <url>\n'
        url_block += f'    <loc>{BASE_URL}/{source_file}</loc>\n'
        url_block += f'    <xhtml:link rel="alternate" hreflang="fr" href="{BASE_URL}/{source_file}"/>\n'
        for lang in LANGS:
            url_block += f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{BASE_URL}/{lang}/{source_file}"/>\n'
        url_block += f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE_URL}/{source_file}"/>\n'
        url_block += '  </url>'
        urls.append(url_block)

    sitemap = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
'''
    sitemap += '\n'.join(urls)
    sitemap += '\n</urlset>\n'

    output_path = ROOT / 'sitemap.xml'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sitemap)
    print(f'  ✓ sitemap.xml')


def main():
    # Parse args
    target_lang = None
    target_page = None
    for i, arg in enumerate(sys.argv[1:]):
        if arg == '--lang' and i + 1 < len(sys.argv) - 1:
            target_lang = sys.argv[i + 2]
        if arg == '--page' and i + 1 < len(sys.argv) - 1:
            target_page = sys.argv[i + 2]
            if not target_page.endswith('.html'):
                target_page += '.html'

    fr_data = load_i18n('fr')

    langs_to_build = [target_lang] if target_lang else LANGS
    pages_to_build = {target_page: PAGES[target_page]} if target_page and target_page in PAGES else PAGES

    print('=== Solfianza i18n Build ===')

    # Update French pages with hreflang + lang switcher
    print('\n[FR] Updating French pages...')
    update_french_pages(fr_data)

    # Build translated pages
    for lang in langs_to_build:
        print(f'\n[{lang.upper()}] Building...')
        try:
            target_data = load_i18n(lang)
        except FileNotFoundError:
            print(f'  [ERROR] i18n/{lang}.json not found, skipping')
            continue

        output_dir = ROOT / lang
        output_dir.mkdir(exist_ok=True)

        for source_file in pages_to_build:
            build_page(source_file, lang, fr_data, target_data, output_dir)

    # Generate sitemap
    print('\n[SITEMAP] Generating...')
    build_sitemap()

    print('\n=== Build complete ===')


if __name__ == '__main__':
    main()
