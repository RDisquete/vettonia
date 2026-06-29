import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import {
  unlockAlbum, isAlbumUnlocked, lockAlbum,
  getPassInfo, setPassName, getPassPhoto, setPassPhoto,
  getMessages, addMessage, deleteMessage,
  getPassStats, getPhotos, getPassPin, setPassPin,
} from '../../lib/storage'
import type { PassInfo, WallMessage, UploadedPhoto } from '../../types'
import type { PassStats } from '../../services/stats'

export type Tab = 'pase' | 'muro' | 'contenido' | 'logros' | 'stats'

export function useAccess() {
  const [unlocked, setUnlocked] = useState(isAlbumUnlocked)
  const [tab, setTab] = useState<Tab>('pase')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)

  const handleSubmit = useCallback(() => {
    if (unlockAlbum(code)) {
      setUnlocked(true)
      setCodeError(false)
    } else {
      setCodeError(true)
    }
  }, [code])

  const handleLogout = useCallback(() => {
    lockAlbum()
    setUnlocked(false)
    setTab('pase')
  }, [])

  return { unlocked, tab, setTab, code, setCode, codeError, setCodeError, handleSubmit, handleLogout }
}

export function usePass() {
  const [passInfo, setPassInfoState] = useState<PassInfo>({ name: '', number: '', createdAt: '' })
  const [passPhoto, setPassPhotoState] = useState<string | null>(null)
  const [passLoading, setPassLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [pin, setPinState] = useState<string | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [showPinInput, setShowPinInput] = useState(false)

  const refresh = useCallback(async () => {
    setPassLoading(true)
    const [info, photo] = await Promise.all([getPassInfo(), getPassPhoto()])
    setPassInfoState(info)
    setPassPhotoState(photo)
    setNameInput(info.name)
    setPinState(getPassPin())
    setPassLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const handlePhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    e.target.value = ''
    const url = await setPassPhoto(f)
    setPassPhotoState(url)
    toast.success('Foto actualizada')
  }, [])

  const handleSaveName = useCallback(async () => {
    await setPassName(nameInput)
    const info = await getPassInfo()
    setPassInfoState(info)
    setEditingName(false)
  }, [nameInput])

  const handleSetPin = useCallback(async () => {
    if (pinInput.length < 4) return
    await setPassPin(pinInput)
    setPinState(pinInput)
    setPinInput('')
    setShowPinInput(false)
    toast.success('PIN actualizado')
  }, [pinInput])

  return {
    passInfo, setPassInfo: setPassInfoState,
    passLoading,
    editingName, setEditingName,
    nameInput, setNameInput,
    passPhoto, setPassPhoto: setPassPhotoState,
    handlePhoto, handleSaveName, refresh,
    pin, pinInput, setPinInput, showPinInput, setShowPinInput, handleSetPin,
  }
}

export function useMessages() {
  const [messages, setMessages] = useState<WallMessage[]>([])
  const [msgLoading, setMsgLoading] = useState(true)
  const [msgText, setMsgText] = useState('')
  const [msgAuthor, setMsgAuthor] = useState('')

  const refresh = useCallback(async () => {
    setMsgLoading(true)
    setMessages(await getMessages())
    setMsgLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const handleAddMessage = useCallback(async () => {
    if (!msgText.trim()) return
    await addMessage(msgText.trim(), msgAuthor.trim() || 'Alma de foso')
    setMessages(await getMessages())
    setMsgText('')
    toast.success('Mensaje publicado')
  }, [msgText, msgAuthor])

  const handleDeleteMessage = useCallback(async (id: string) => {
    await deleteMessage(id)
    setMessages(await getMessages())
    toast.success('Mensaje eliminado')
  }, [])

  return {
    messages, msgLoading,
    msgText, setMsgText,
    msgAuthor, setMsgAuthor,
    handleAddMessage, handleDeleteMessage, refresh,
  }
}

export function useStats() {
  const [stats, setStats] = useState<PassStats>({ photosUploaded: 0, totalLikes: 0, uniqueAuthors: 0, joinDate: '' })
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setStatsLoading(true)
    const [s, p] = await Promise.all([getPassStats(), getPhotos()])
    setStats(s)
    setPhotos(p)
    setStatsLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { stats, photos, statsLoading, refresh }
}
