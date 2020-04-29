import React, {
   createContext,
   useState,
   useMemo,
   useContext,
   cloneElement,
   isValidElement
} from 'react'

type ResultBox<T> = { v: T }

function useConstant<T>(fn: () => T): T {
   const ref = React.useRef<ResultBox<T>>()

   console.log({ ref })
   if (!ref.current) {
      ref.current = { v: fn() }
   }

   return ref.current.v
}

const TabsState = createContext({} as any)
const Elements = createContext({} as any)

export const Tabs = ({ state: outerState, children }: any) => {
   const innerState = useState(0)
   const elements = useConstant(() => ({ tabs: 0, panels: 0 }))
   const state = outerState || innerState

   return (
      <Elements.Provider value={elements}>
         <TabsState.Provider value={state}>
            {children}
         </TabsState.Provider>
      </Elements.Provider>
   )
}

export const useTabState = () => {
   const [activeIndex, setActive] = useContext(TabsState)
   const elements = useContext(Elements)

   const tabIndex = useConstant(() => {
      const currentIndex = elements.tabs
      elements.tabs += 1
      return currentIndex
   })



   const onClick = useConstant(() => () => setActive(tabIndex))

   const state = useMemo(
      () => ({
         isActive: activeIndex === tabIndex,
         onClick
      }),
      [activeIndex, onClick, tabIndex]
   )

   return state
}

export const usePanelState = () => {
   const [activeIndex] = useContext(TabsState)

   const elements = useContext(Elements)

   const panelIndex = useConstant(() => {
      const currentIndex = elements.panels
      elements.panels += 1

      return currentIndex
   })

   return panelIndex === activeIndex
}

export const Tab = ({ children }: any) => {
   const state = useTabState()

   if (typeof children === 'function') {
      return children(state)
   }

   return isValidElement(children) ? cloneElement(children, state) : children
}

export const Panel = ({ active, children }: any) => {
   const isActive = usePanelState()

   return isActive || active ? children : null
}