import axios from './axios.js'

interface IFile {
  name: string;
  id: string;
}

export const getDownloadFiles = () => axios.get('/downloads')
export const postDownloadFiles = (file: IFile) => axios.post('/downloads', file)
