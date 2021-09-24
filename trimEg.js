var str = "    ";
console.log(str.replace(/\s/g, '').length);
if (!str.replace(/\s/g, '').length) {
  console.log('string only contains whitespace (ie. spaces, tabs or line breaks)');
}