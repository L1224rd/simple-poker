const gel = element => document.querySelector(element);

gel.get = (url, callback) => {
  const http = new XMLHttpRequest();
  http.open('GET', url, true);

  http.onload = function () {
    if (http.status >= 200 && http.status < 400) {
      // Success!
      callback(http.responseText);
    } else {
      callback('server-error');
    }
  };

  http.send();
};

let cardsFlag = 0;

const nipes = ['red', 'black', 'green', 'blue'];

const letter = (num) => {
  if (num === 1) return 'A';
  if (num === 11) return 'J';
  if (num === 12) return 'Q';
  if (num === 13) return 'K';
  return num;
};

gel('#button-get-card').addEventListener('click', () => {
  if (cardsFlag) return;
  cardsFlag = 1;
  gel.get('/card', (res) => {
    gel('#my-cards').innerHTML += `<span style="color: ${nipes[Math.floor(+res / 13)]}; font-size: 40px; margin-right: 10px; margin-bottom: 30px;">${letter((+res % 13) + 1)}</span>`;
  });
  gel.get('/card', (res) => {
    gel('#my-cards').innerHTML += `<span style="color: ${nipes[Math.floor(+res / 13)]}; font-size: 40px; margin-right: 10px; margin-bottom: 30px;">${letter((+res % 13) + 1)}</span>`;
  });
});

gel('#button-next-card').addEventListener('click', () => {
  gel.get('/card', () => { });
});

gel('#button-reset').addEventListener('click', () => {
  gel.get('/reset', () => { });
});

let currentLength = 0;

gel('#other-cards').addEventListener('click', () => {
  gel('#other-cards').style.display = 'none';
});

setInterval(() => {
  if (window.location.href.indexOf('caraca') !== -1) {
    gel.get('/caraca', (res) => {
      const data = JSON.parse(res);
      gel('#other-cards').innerHTML = '';
      data.forEach((card) => {
        gel('#other-cards').innerHTML += `<span style="color: ${nipes[Math.floor(+card / 13)]}; font-size: 40px; margin-right: 10px; margin-bottom: 30px;">${letter((+card % 13) + 1)}</span>`;
      });
    });
  }
  gel.get('/cards', (res) => {
    const data = JSON.parse(res);
    if (!data.status) {
      gel('#my-cards').innerHTML = '';
      cardsFlag = 0;
    }
    if (currentLength === data.cards.length) return;
    gel('#common-cards').innerHTML = '';
    currentLength = data.cards.length;
    data.cards.forEach((card) => {
      gel('#common-cards').innerHTML += `<span style="color: ${nipes[Math.floor(+card / 13)]}; font-size: 40px; margin-right: 10px; margin-bottom: 30px;">${letter((+card % 13) + 1)}</span>`;
    });
  });
}, 500);