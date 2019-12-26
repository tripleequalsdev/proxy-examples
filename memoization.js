function createHandler(target) {
  // Assuming that target function does not depend on `this`
  return {
    previousArgs: undefined,
    cachedResult: undefined,

    apply: function (target, thisArg, args) {
      if (Array.isArray(this.previousArgs)
        && this.previousArgs.length === args.length
        && this.previousArgs.every((prevArg, i) => prevArg === args[i])) {
        return this.cachedResult
      }

      const newResult = target.apply(thisArg, args.slice(args))
      this.cachedResult = newResult
      this.previousArgs = args

      return newResult
    }
  }
}

function withMemo(target) {
  const handler = createHandler(target)
  return new Proxy(target, handler)
}