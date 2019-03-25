export default {
  filters: {
    textOverflow(value, num) {
      if (!num) {
        num = 125;
      }
      if (value.length > num) {
        var str = value.substring(0, num);
        str += '...';
        return str;
      }
      return value;
    }
  }
};
