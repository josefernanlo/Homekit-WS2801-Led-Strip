function promise(promise) {
    if (promise.isFulfiled) return promise

    // Estados
    let isPending = true;
    let isRejected = false;
    let isFulfiled = false;

    // Resultados de las promesas

    const result = promise.then((success) => {
        isPending = false;
        isFulfiled = true;
        return success
    }, (reject) => {
        isRejected = true;
        isPending = false;
        throw reject
    });

    result.isFulfiled = () => isFulfiled;
    result.isPending = () => isPending;
    result.isRejected = () => isRejected;

    return result;
}

module.exports = {
    promise
}