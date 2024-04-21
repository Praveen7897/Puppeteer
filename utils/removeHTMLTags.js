// Function to remove HTML tags from a string
function removeHtmlTags(str) {
  if (typeof str !== 'string') {
    return str; 
  }
  return str.replace(/<[^>]*>/g, ''); 
}

module.exports= removeHtmlTags