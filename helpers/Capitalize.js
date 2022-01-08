/**
 * Function that capitalizes the first letter of each word of the text sent by parameter.
 * @param { string } str Text string to transform.
 * @returns { string }
 */
const toTitleCase = ( str ) => {
  return str.replace(/\w\S*/g, ( txt ) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

module.exports = {
  toTitleCase,
};