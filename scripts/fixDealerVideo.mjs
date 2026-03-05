const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

async function mutateSanity(mutations) {
  const url = 'https://' + projectId + '.api.sanity.io/v' + apiVersion + '/data/mutate/' + dataset
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ mutations })
  })
  return res.json()
}

async function fix() {
  const mutations = [
    {
      patch: {
        id: 'v91oyAj2vrN2ok9DE3WFgd',
        set: {
          localVideoPath: '/videos/san-marino-vernici.mp4'
        }
      }
    }
  ]
  const result = await mutateSanity(mutations)
  console.log(JSON.stringify(result, null, 2))
}

fix()
