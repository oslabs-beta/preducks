import './styles/index.css';

window.addEventListener('DOMContentLoaded', () => {
  const userAgent = navigator.userAgent;

  const updateDownloadLinks = (platformName, downloadLink) => {
    const nameLocations = Array.from(document.getElementsByClassName('platformName'));
    const linkLocations = Array.from(document.getElementsByClassName('downloadLink'));
    const platforms = ['macOS', 'Windows', 'Linux'];
    platforms.splice(platforms.indexOf(platformName), 1);
    nameLocations.forEach((element) => {
      element.innerText = platformName;
    });
    linkLocations.forEach((element) => {
      element.setAttribute('href', downloadLink);
    });
    document.getElementById('other-platform-names').innerText = platforms
      .toString()
      .replace(',', ', ');
  };

  const updateBrowserIcon = (browser, isSVG = false, hasiOS = true) => {
    let thisBrowser = browser;
    if (userAgent.includes('iPhone') && hasiOS) {
      thisBrowser = `ios-${thisBrowser}`;
    }
    document.getElementById('browser-icon').src = `./images/browsers/${thisBrowser}${
      isSVG ? '.svg' : '.png'
    }`;
    if (isSVG) {
      document.getElementById('browser-icon').srcset = `./images/browsers/${thisBrowser}.svg`;
    } else {
      document.getElementById(
        'browser-icon',
      ).srcset = `./images/browsers/${thisBrowser}.png, ./images/browsers/${thisBrowser}@2x.png 2x, ./images/browsers/${thisBrowser}@3x.png 3x`;
    }
  };

  if (userAgent.includes('Win')) {
    updateDownloadLinks('Windows', 'https://google.com/?search=preducks-windows');
  } else if (userAgent.includes('Linux')) {
    updateDownloadLinks('Linux', 'https://google.com/?search=preducks-linux');
  }

  if (userAgent.includes('Firefox') || userAgent.includes('FxiOS')) {
    updateBrowserIcon('firefox');
  } else if (userAgent.includes('Edge')) {
    updateBrowserIcon('edge', true);
  } else if (userAgent.includes('UCBrowser')) {
    updateBrowserIcon('uc', false, false);
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    updateBrowserIcon('opera');
  } else if (userAgent.includes('SamsungBrowser')) {
    updateBrowserIcon('samsung', false, false);
  } else if (userAgent.includes('Chrome')) {
    updateBrowserIcon('chrome');
  } else if (userAgent.includes('Android')) {
    updateBrowserIcon('android', false, false);
  } else if (userAgent.includes('Safari')) {
    console.log('safari');
  } else if (userAgent.includes('Trident') || userAgent.includes('MSIE')) {
    updateBrowserIcon('explorer', true, false);
  }

  const duck = document.getElementById('footer-duck');

  const spin = () => {
    if (document.getElementById('footer-duck').className === 'spin') {
      duck.className = '';
    } else {
      duck.className = 'spin';
    }
  };

  duck.addEventListener('click', () => spin('select'));
});

window.addEventListener('load', () => {
  setTimeout(() => {
    const app = document.createElement('script');
    app.src = 'app.js';
    app.type = 'text/javascript';
    app.defer = true;
    document.head.appendChild(app);
  }, 500);
});
