import { FC } from 'react'
import { Title, HeadProvider } from 'react-head'
import Content from './Content'

const App: FC = () => {
  return (
    <>
      <HeadProvider>
        <Title>Jump AI</Title>
        <Content />
      </HeadProvider>
    </>
  )
}

export default App
