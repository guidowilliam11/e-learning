export const _serverActionDataAdapter = (data) => {
  return JSON.parse(JSON.stringify(data))
}

const _dataAdapter = async res => {
  let body
  try {
    body = await res.json()
  } catch {
    try {
      body = await res.text()
    } catch {
      body = res.data
    }
  }

  return {
    body,
    status: res.status,
    statusText: res.status,
    headers: res.headers || res.config?.headers || {},
    originalResponse: res
  }
}

export const _responseAdapter = async res => {
  const response = await _dataAdapter(res)
  if (!res.ok) {
    throw response
  }
  return response
}