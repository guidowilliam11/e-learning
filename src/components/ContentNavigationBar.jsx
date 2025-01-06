const Tab = ({ tab, activeTab, tabIndex, onClick }) => {
  const isActive = activeTab === tabIndex

  return (
    <button
      onClick={onClick}
      className={
        "underline-offset-4 cursor-pointer hover:text-primary transition duration-300 " +
        (isActive ? "text-primary underline " : "text-neutral-50 ")
      }
    >
      {tab.name}
    </button>
  )
}

const ContentNavigationBar = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <nav className="flex bg-secondary p-5 gap-5 text-lg rounded-md drop-shadow-md">
      {tabs.map((tab, index) => (
        <Tab
          key={tab.value}
          tab={tab}
          activeTab={activeTab}
          tabIndex={index}
          onClick={() => setActiveTab(index)}
        />
      ))}
    </nav>
  )
}

export default ContentNavigationBar
