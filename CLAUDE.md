# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Nova Security's Jekyll-based portfolio and blog website. The site showcases the company's cybersecurity and penetration testing services with a focus on educational blog content about security research and vulnerabilities.

## Development Commands

### Local Development
```bash
# Install dependencies
bundle install

# Start local development server
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

### Deployment
The site is configured for Netlify deployment with automatic builds from the main branch:
- Build command: `jekyll build`
- Publish directory: `_site`
- Environment: `JEKYLL_ENV=production`

## Architecture Overview

### Jekyll Structure
- **_config.yml**: Main configuration file with site settings, SEO metadata, and build configuration
- **_layouts/**: Page templates (default.html, page.html, category.html, tag.html)
- **_includes/**: Reusable components (header, footer, navigation, blog components)
- **_posts/**: Blog posts in Markdown format with YAML front matter
- **_sass/**: Stylesheets organized into elements, template-parts, and templates
- **_data/**: Configuration data (menus.yml, social.json)
- **assets/**: Static assets (CSS, JS, images, fonts)

### Content Management
- Blog posts follow the naming convention: `YYYY-MM-DD-title.md`
- Posts require YAML front matter with: layout, title, date, description, author, tags, categories
- Categories: Software, Security, Technology, Innovation, Agency
- Tags: Used for detailed topic classification

### Styling Architecture
- Bootstrap-based responsive design
- Custom SCSS in `_sass/` directory
- Modular approach with separate files for elements, template parts, and page templates
- Animation support via animate.css
- Swiper for carousels/sliders

### Key Features
- SEO optimization with Open Graph and Twitter meta tags
- Google Analytics integration (configured in _config.yml)
- Jekyll archives for category and tag pages
- Pagination support for blog listings
- Search functionality
- Contact forms and service pages

## Important Notes

- The site uses Jekyll 4.x with GitHub Pages compatibility
- Ruby gems managed via Bundler
- No package.json - this is a pure Jekyll/Ruby project
- Site title: "Nova Security - Secure Your Future, Today"
- Content focuses on cybersecurity, penetration testing, and security research