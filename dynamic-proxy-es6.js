function createHandler() {
  return {
    cache: new Map(),

    get: function (target, prop) {
      const { cache } = this

      if (typeof target[prop] === "function") {
        // Assuming that target function is pure and does not depend on `this`
        return function (...args) {
          const memoizedData = cache.get(prop)

          if (memoizedData
            && memoizedData.previousArgs.length === args.length
            && memoizedData.previousArgs.every((prevArg, i) => prevArg === args[i])) {
            return memoizedData.cachedResult
          }

          const newResult = target[prop].apply(this, args)
          cache.set(prop, { cachedResult: newResult, previousArgs: args })

          return newResult
        }
      } else {
        return target[prop]
      }
    }
  }
}

function withMemo(target) {
  const handler = createHandler()
  return new Proxy(target, handler)
}

function heavyComputation() {
  let startDate = new Date()
  let currentDate

  do {
    currentDate = new Date()
  } while (currentDate - startDate < 2000)
}

const timeConsumingCalculator = {
  version: 1,
  add: (a, b) => {
    heavyComputation()
    return a + b
  },
  subtract: (a, b) => {
    heavyComputation()
    return a - b
  },
  multiply: (a, b) => {
    heavyComputation()
    return a * b
  },
  divide: (a, b) => {
    heavyComputation()
    return a / b
  },
}