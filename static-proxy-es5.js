function withMemoEs5(targetObj) {
  var proxy = Object.create(Object.getPrototypeOf(targetObj), {})
  Object.getOwnPropertyNames(targetObj).forEach(function (name) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(targetObj, name)
    if (typeof targetObj[name] === "function") {
      var previousArgs
      var cachedResult

      Object.defineProperty(proxy, name, {
        // Assuming that target function is pure and does not depend on `this`
        value: function value() {
          var args = Array.prototype.slice.call(arguments)

          if (Array.isArray(previousArgs)
            && previousArgs.length === args.length
            && previousArgs.every(function (prevArg, i) { return prevArg === args[i] })) {
            return cachedResult
          }

          var newResult = targetObj[name].apply(this, args)
          cachedResult = newResult
          previousArgs = args

          return newResult
        },
        configurable: propertyDescriptor.configurable,
        enumerable: propertyDescriptor.enumerable,
      })
    } else {
      Object.defineProperty(proxy, name, propertyDescriptor)
    }
  })
  return proxy
}

function heavyComputation() {
  var startDate = new Date()
  var currentDate

  do {
    currentDate = new Date()
  } while (currentDate - startDate < 2000)
}

var timeConsumingCalculator = {
  version: 1,
  add: function add(a, b) {
    heavyComputation()
    return a + b
  },
  subtract: function subtract(a, b) {
    heavyComputation()
    return a - b
  },
  multiply: function multiply(a, b) {
    heavyComputation()
    return a * b
  },
  divide: function divide(a, b) {
    heavyComputation()
    return a / b
  },
}