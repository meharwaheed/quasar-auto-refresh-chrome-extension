import { bexBackground } from 'quasar/wrappers'

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.onClicked.addListener((/* tab */) => {
    // Opens our extension in a new browser window.
    // Only if a popup isn't defined in the manifest.
    chrome.tabs.create({
      url: chrome.runtime.getURL('www/index.html')
    }, (/* newTab */) => {
      // Tab opened.
    })
  })
})

export default bexBackground((bridge /* , allActiveConnections */) => {
  bridge.on('log', ({ data, respond }) => {
    console.log(`[BEX] ${data.message}`, ...(data.data || []))
    respond()
  })

  bridge.on('getTime', ({ respond }) => {
    respond(Date.now())
  })

  bridge.on('storage.get', ({ data, respond }) => {
    const { key } = data
    if (key === null) {
      chrome.storage.local.get(null, items => {
        // Group the values up into an array to take advantage of the bridge's chunk splitting.
        respond(Object.values(items))
      })
    } else {
      chrome.storage.local.get([key], items => {
        respond(items[key])
      })
    }
  })
  // Usage:
  // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  bridge.on('storage.set', ({ data, respond }) => {
    chrome.storage.local.set({ [data.key]: data.value }, () => {
      respond()
    })
  })
  // Usage:
  // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  bridge.on('storage.remove', ({ data, respond }) => {
    chrome.storage.local.remove(data.key, () => {
      respond()
    })
  })
  // Usage:
  // await bridge.send('storage.remove', { key: 'someKey' })

  /*
  // EXAMPLES
  // Listen to a message from the client
  bridge.on('test', d => {
    console.log(d)
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
  bridge.on('reloading.page', (data) => {
    let delay = data[Math.floor(Math.random()*data.length)];
    let chrome_tab = null
    chrome.tabs.query({active: true}, function (arrayOfTabs) {
      if(arrayOfTabs[0] && arrayOfTabs[0].id) {
        chrome_tab = arrayOfTabs[0].id
      }
    });
    // setInterval(function() {
      // delay = data[Math.floor(Math.random()*data.length)];
      // document.win/dow.location.reload()
    if(chrome_tab) {
      chrome.tabs.query({active: true}, function (arrayOfTabs) {
        if(arrayOfTabs[0] && arrayOfTabs[0].id)
          console.log('page reloading at ' + new Date());
        chrome.tabs.reload(chrome_tab);
      });
    }
      // respond()
      // bridge.send('reloading.page', data);
    // }, 5000);
  })
})
