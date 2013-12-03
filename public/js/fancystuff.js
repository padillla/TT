
//some functions I'd like to have in hand
//mixes all arrays I throw at it
function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}

function flatten(arrays) {
    var result = [];
    forEach(arrays, function (array) {
      forEach(array, function (element){result.push(element);});
    });
    return result;
  }