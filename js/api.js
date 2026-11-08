const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: ''
};

const ErrorText = {
  GET_DATA: 'При получении данных произошла ошибка. Попробуйте обновить страницу',
  SEND_DATA: 'При отправке данных произошла ошибка. Попробуйте ещё раз'
};

const fetchServer = (route, errorText = null, method = 'GET', body = null) => fetch(`${BASE_URL}${route}`, {method, body})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`При соединении с сервером произошла ошибка ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .catch((err) => {
    throw new Error(errorText ?? err.message);
  });

const getData = () => fetchServer(Route.GET_DATA, ErrorText.GET_DATA);

const sendData = (body) => fetchServer(Route.SEND_DATA, ErrorText.SEND_DATA, 'POST', body);

export {getData, sendData};
