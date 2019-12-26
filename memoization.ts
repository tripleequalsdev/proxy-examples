interface WithMemoProxyHandler<T extends (...args: any) => any> extends ProxyHandler<T> {
  previousArgs?: Array<any>
  cachedResult?: ReturnType<T>
}

function createHandler<T extends (...args: any) => any>(): WithMemoProxyHandler<T> {
  return {
    previousArgs: undefined,
    cachedResult: undefined,

    // Assuming that target function does not depend on `this`
    apply: function (target: T, thisArg: ThisType<any>, args: Parameters<T>) {
      if (Array.isArray(this.previousArgs)
        && this.previousArgs.length === args.length
        && this.previousArgs.every((prevArg, i) => prevArg === args[i])) {
        return this.cachedResult
      }

      const newResult = target.apply(thisArg, args)
      this.cachedResult = newResult
      this.previousArgs = args

      return newResult
    }
  }
}

function withMemo<T extends (...args: any) => any>(target: T): (...args: Parameters<T>)
  => ReturnType<T> {
  const handler = createHandler()
  return new Proxy(target, handler)
}