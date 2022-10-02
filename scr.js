(() => {
  const parsePlaylist = (container) => {
    return [...container.querySelectorAll('.audio_row__performer_title')].map(
      (row) => {
        const [artist, title] = ['.audio_row__performers', '.audio_row__title']
          .map(selector => row.querySelector(selector)?.textContent || '')
          .map((v) => v.replace(/[\s\n ]+/g, ' ').trim());

        return [artist, title].join(' - ');
      },
    );
  }

  const saveToFile = (filename, content) => {
    const data = content.replace(/\n/g, '\r\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');

    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const container = document.querySelector('[class*="ap_layer_wrap"]');
  let notChangedStepsCount = 0;
  let y = 0;
  let flag = false;

  const scrollToBottom = setInterval(function() {
    const element = document.querySelector('[class*="audio_pl_snippet__stats"]');
    container.scroll(0, container.scrollHeight)
    if (container.scrollHeight === y) {
      notChangedStepsCount++;
    }
    y = container.scrollHeight
    if (notChangedStepsCount > 10) {
      clearInterval(scrollToBottom);
      flag = true;
    }
  }, 20);

  const main = setInterval(function() {
    // wait for scrollToBottom
    if (flag) {
      // save
      const list = parsePlaylist(container);
      const playlistName = document
        .querySelector('[class*="audio_pl_snippet_info_maintitle"]')
        .innerText.split(' ').join('_');
      saveToFile(`vk-playlist_${playlistName}.txt`, list.join('\n'));
      //clear
      clearInterval(main);
      container.scroll(0,0);
    }
  }, 100);
})();
