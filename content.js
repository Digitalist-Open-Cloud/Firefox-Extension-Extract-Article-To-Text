(function() {
  const ARTICLE_SELECTORS = [
    'article',
    '[role="main"]',
    'main',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.article-body',
    '.story-body',
    '.content-body',
    '.post-body',
    '.blog-post',
    '.single-post',
    '#content',
    '#main-content',
    '#article',
    '.content',
    '#content'
  ];

  const REMOVE_SELECTORS = [
    'script', 'style', 'noscript', 'iframe', 'form', 'input', 'button',
    'nav', 'header', 'footer', 'aside',
    '.sidebar', '.widget', '.advertisement', '.ad', '.ads',
    '.navigation', '.nav', '.menu', '.comments', '.comment',
    '.related', '.recommended', '.share', '.social',
    '.breadcrumb', '.pagination', '.tags', '.meta',
    '.author-bio', '.bio', '.subscription', '.newsletter',
    '.popup', '.modal', '.overlay', '.banner',
    '[role="navigation"]', '[role="banner"]', '[role="complementary"]',
    '.site-header', '.site-footer', '.masthead',
    '.entry-meta', '.post-meta', '.article-meta',
    '.wp-caption', '.gallery', '.slideshow',
    '.sponsored', '.promo', '.promotion'
  ];

  function findArticleElement() {
    for (const selector of ARTICLE_SELECTORS) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 500) {
        return element;
      }
    }
    return document.body;
  }

  function cleanElement(element) {
    const clone = element.cloneNode(true);

    REMOVE_SELECTORS.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    clone.querySelectorAll('[class*="nav"]').forEach(el => el.remove());
    clone.querySelectorAll('[class*="sidebar"]').forEach(el => el.remove());
    clone.querySelectorAll('[class*="comment"]').forEach(el => el.remove());
    clone.querySelectorAll('[class*="share"]').forEach(el => el.remove());
    clone.querySelectorAll('[class*="social"]').forEach(el => el.remove());
    clone.querySelectorAll('[class*="ad-"]').forEach(el => el.remove());
    clone.querySelectorAll('[id*="nav"]').forEach(el => el.remove());
    clone.querySelectorAll('[id*="sidebar"]').forEach(el => el.remove());
    clone.querySelectorAll('[id*="comment"]').forEach(el => el.remove());
    clone.querySelectorAll('[id*="footer"]').forEach(el => el.remove());
    clone.querySelectorAll('[id*="header"]').forEach(el => el.remove());

    clone.querySelectorAll('a').forEach(a => {
      const text = a.textContent;
      a.replaceWith(text);
    });

    clone.querySelectorAll('img').forEach(img => {
      const alt = img.alt;
      if (alt) {
        img.replaceWith(`[Image: ${alt}]`);
      } else {
        img.remove();
      }
    });

    clone.querySelectorAll('figure').forEach(fig => {
      const caption = fig.querySelector('figcaption');
      if (caption) {
        fig.replaceWith(caption.textContent);
      } else {
        fig.remove();
      }
    });

    return clone;
  }

  function extractText(element) {
    const cleaned = cleanElement(element);
    let text = cleaned.textContent;

    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.replace(/[ \t]+/g, ' ');
    text = text.trim();

    return text;
  }

  function getTitle() {
    const titleEl = document.querySelector('h1') ||
                    document.querySelector('[class*="title"]') ||
                    document.querySelector('title');
    return titleEl ? titleEl.textContent.trim() : document.title;
  }

  function getMetaDescription() {
    const meta = document.querySelector('meta[name="description"]') ||
                 document.querySelector('meta[property="og:description"]');
    return meta ? meta.getAttribute('content') : '';
  }

  const articleElement = findArticleElement();
  const title = getTitle();
  const description = getMetaDescription();
  const content = extractText(articleElement);

  const result = {
    title: title,
    url: window.location.href,
    description: description,
    content: content
  };

  window.postMessage({ type: 'ARTICLE_EXTRACTED', data: result }, '*');
})();
