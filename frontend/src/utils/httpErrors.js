import axios from 'axios'

export function getErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallbackMessage
  }

  return fallbackMessage
}

export function getValidationErrors(error) {
  if (!axios.isAxiosError(error)) {
    return null
  }

  return error.response?.status === 422 ? error.response.data?.errors ?? null : null
}

export function isRequestCanceled(error) {
  return axios.isCancel(error) || error?.code === 'ERR_CANCELED'
}
