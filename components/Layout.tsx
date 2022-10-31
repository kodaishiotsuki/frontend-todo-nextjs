import Head from 'next/head'
import React, { FC, ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

const Layout: FC<Props> = ({ title = 'Next.js', children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex w-screen flex-1 flex-col items-center justify-center">
        {children}
      </main>
    </div>
  )
}

export default Layout
