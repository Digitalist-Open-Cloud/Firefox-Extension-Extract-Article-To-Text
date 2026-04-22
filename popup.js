document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const result = document.getElementById('result');
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copy-btn');
  const copyStatus = document.getElementById('copy-status');

  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var ARTICLE_SELECTORS = [
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
          '.content'
        ];

        var REMOVE_TAGS = ['script', 'style', 'noscript', 'iframe', 'form', 'nav', 'header', 'footer', 'aside'];
        var REMOVE_CLASSES = ['sidebar', 'widget', 'ad', 'nav', 'menu', 'comment', 'share', 'social', 'meta', 'related', 'footer', 'header'];

        function findArticle() {
          for (var i = 0; i < ARTICLE_SELECTORS.length; i++) {
            var el = document.querySelector(ARTICLE_SELECTORS[i]);
            if (el && el.textContent.trim().length > 200) {
              return el;
            }
          }
          return document.body;
        }

        function cleanNode(node) {
          var clone = node.cloneNode(true);

          REMOVE_TAGS.forEach(function(tag) {
            clone.querySelectorAll(tag).forEach(function(el) { el.remove(); });
          });

          REMOVE_CLASSES.forEach(function(cls) {
            clone.querySelectorAll('[class*="' + cls + '"]').forEach(function(el) { el.remove(); });
          });

          clone.querySelectorAll('a').forEach(function(a) {
            var text = a.textContent;
            a.parentNode.replaceChild(document.createTextNode(text), a);
          });

          clone.querySelectorAll('img').forEach(function(img) {
            var alt = img.alt;
            if (alt) {
              img.parentNode.replaceChild(document.createTextNode('[Image: ' + alt + ']'), img);
            } else {
              img.remove();
            }
          });

          return clone;
        }

        function extractText(element) {
          var cleaned = cleanNode(element);
          var text = cleaned.textContent || '';

          var pTexts = [];
          var paragraphs = cleaned.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote');

          if (paragraphs.length > 0) {
            paragraphs.forEach(function(p) {
              var t = p.textContent.replace(/^\s+/, '').trim();
              if (t.length > 0) {
                pTexts.push(t);
              }
            });
            text = pTexts.join('\n\n');
          }

          text = text.replace(/\n{3,}/g, '\n\n').trim();
          return text;
        }

        function getTitle() {
          var h1 = document.querySelector('h1');
          if (h1) return h1.textContent.trim();
          var title = document.querySelector('[class*="title"]');
          if (title) return title.textContent.trim();
          return document.title;
        }

        var article = findArticle();
        var title = getTitle();
        var url = window.location.href;
        var content = extractText(article);

        return { title: title, url: url, content: content };
      }
    });

    const extractedData = results[0]?.result;

    if (extractedData && extractedData.content && extractedData.content.length > 100) {
      loading.classList.add('hidden');
      result.classList.remove('hidden');

      titleInput.value = extractedData.title || '';
      urlInput.value = extractedData.url || '';
      output.value = extractedData.content || '';
    } else {
      loading.classList.add('hidden');
      error.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error:', err);
    loading.classList.add('hidden');
    error.classList.remove('hidden');
  }

  const saveBtn = document.getElementById('download-btn');

  function showStatus(msg) {
    copyStatus.textContent = msg;
    setTimeout(() => { copyStatus.textContent = ''; }, 2000);
  }

  function getTextForExport() {
    const title = titleInput.value;
    return title + '\n\n' + output.value + '\n\nSource: ' + urlInput.value;
  }

  copyBtn.addEventListener('click', async () => {
    try {
      const text = getTextForExport();
      await navigator.clipboard.writeText(text);
      showStatus('Copied!');
    } catch (err) {
      showStatus('Copy failed');
    }
  });

  saveBtn.addEventListener('click', () => {
    const text = getTextForExport();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = titleInput.value.replace(/[^a-z0-9]/gi, '_').substring(0, 50) + '.txt';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('Downloaded!');
  });
});
