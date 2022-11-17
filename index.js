async function asyncPromise(par1) {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(par1) || par1 > 50000) {
      reject(new Error('Invalid input'))
    }
    setTimeout(() => {
      if (par1 + 1000 > 25000) {
        reject(new Error('Server Timeout'))
      } else { resolve(par1 * 2) }
    }, 1000 + par1)
  })
}

async function asyncParallel1(par1) {
  return new Promise((resolve, reject) => {
    if (par1 / 2 > 10000) {
      reject(new Error('Parallel 1 timed out'))
    }
    setTimeout(() => {
      resolve(true)
    }, par1 / 2)
  })
}

async function asyncParallel2(par1) {
  return new Promise((resolve, reject) => {
    if (par1 / 3 > 10000) {
      reject(new Error('Parallel 2 timed out'))
    }
    setTimeout(() => {
      resolve(true)
    }, par1 / 3)
  })
}

async function asyncParallel3(par1) {
  return new Promise((resolve, reject) => {
    if (par1 / 4 > 10000) {
      setTimeout(() => {
        reject(new Error('Parallel 3 timed out'))
      }, par1 / 4)
    }
    setTimeout(() => {
      resolve(true)
    }, par1 / 4)
  })
}

async function runAsyncParallels(par1) {
  const results = await Promise.allSettled([
    asyncParallel1(par1),
    asyncParallel2(par1),
    asyncParallel3(par1),
  ])

  const fulfilled = results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  const rejected = results.filter((result) => result.status === 'rejected').map((result) => result.reason)
  const joined = rejected.concat(fulfilled)
  console.log(`all parallel calls completed \n${joined.join('\n')}`)
}

function asyncCB(par1, cb) {
  asyncPromise(par1)
    .then((value) => {
      cb(null, value)
      asyncCB(value, cb)
    })
    .catch((error) => { cb(error, null) })

  runAsyncParallels(par1)
}

function myCallback(err, result) {
  if (err) {
    console.log(`ERR: ${err.message}`)
  } else {
    console.log(`SUCCESS: ${result}`)
  }
}

asyncCB(30, myCallback)
