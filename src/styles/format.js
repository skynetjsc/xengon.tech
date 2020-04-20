export default {
  specialCharacter: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
  carNumber: /^([\w+\-\.]+ )+[\w+\-\.]+$|^[\w+\-\.]+$/,
  email: /[`!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/, // check ky tu dac biet
  emailType: /^((?!\.)[\w-_.]*[^.])(@[\w+-]*)(\.\w+(\.\w+)?[^.\W])$/, // check email thuoc dang ..@... hay ko
  getVideoID: /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/, //get videoID tu link youtube
  startTime:/^[\d:]*/,
  inputDateFormat: 'YYYY-MM-DD',
  inputDateTimeFormat: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm',
  ddddDDMMYYYY: "dddd DD/MM/YYYY",
  ddddDDMMYYYYHHMMSS: "dddd DD/MM/YYYY HH:mm:ss",
  ddmmyyyy: "DD/MM/YYYY",
  numberStringToCurrencyString: (number) => {return `${number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')  }đ`;}
};
