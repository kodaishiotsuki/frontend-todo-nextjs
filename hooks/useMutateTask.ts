import { Task } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/router'
import useStore from '../store'
import { EditedTask } from '../types'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const useMutateTask = () => {
  const router = useRouter()
  const QueryClient = useQueryClient()
  //zustandからresetEditedTask呼び出し
  const reset = useStore((state) => state.resetEditedTask)

  //新規作成タスク
  const createTaskMutation = useMutation(
    async (task: Omit<EditedTask, 'id'>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task
      )
      return res.data
    },
    {
      onSuccess: (res) => {
        //既存のタスクのキャッシュ取得
        const previousTasks = QueryClient.getQueryData<Task[]>(['tasks'])
        //新規タスクを配列の先頭に格納(既存のキャッシュを更新)
        if (previousTasks) {
          QueryClient.setQueryData(['tasks'], [res, ...previousTasks])
        }
        reset()
      },
      onError: (err: any) => {
        reset()
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )

  //タスク更新
  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task
      )
      return res.data
    },
    {
      onSuccess: (res, variables) => {
        //既存のタスクのキャッシュ取得
        const previousTasks = QueryClient.getQueryData<Task[]>(['tasks'])
        //既存タスクのid取得→id同じres(更新),違うtask（配列に戻す）
        if (previousTasks) {
          QueryClient.setQueryData(
            ['tasks'],
            previousTasks.map((task) => (task.id === res.id ? res : task))
          )
        }
        reset()
      },
      onError: (err: any) => {
        reset()
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )

  //タスク削除
  const deleteTaskMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`)
    },
    {
      onSuccess: (_, variables) => {
        const previousTasks = QueryClient.getQueryData<Task[]>(['tasks'])
        //axiosで削除したタスクを、既存のタスクから排除する(filterで削除したタスク以外で配列を作り直す)
        if (previousTasks) {
          QueryClient.setQueryData(
            ['tasks'],
            previousTasks.filter((task) => task.id !== variables)
          )
        }
        reset()
      },
      onError: (err: any) => {
        reset()
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}

export default useMutateTask
