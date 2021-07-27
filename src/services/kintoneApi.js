// 获取空间应用列表
export const GetSpaceAppsInfo = async (id) => {
  const spaceInfo = await GetSpaceInfo(id).catch(() => {})
  const appIds = spaceInfo.attachedApps.map((app) => app.appId)
  return GetAppInfo(appIds)
    .then((appsInfo) => {
      spaceInfo.apps = appsInfo
      return spaceInfo
    })
    .catch(() => {})
}

// 获取空间列表
export const GetMySpacesList = async (offset, size) => {
  const mySpaces = await kintone
    .api(kintone.api.url('/k/api/m/space/listMySpacesFirst.json', true), 'POST', {
      offset: offset || 0,
      size: size || 50,
    })
    .catch(() => {})
  const { items, hasMore } = mySpaces.result
  const promiseArray = items.map((item) => GetSpaceInfo(item.id).catch(() => {}))
  const spaceList = await Promise.all(promiseArray).catch(() => {})
  return { spaceList, hasMore }
}

// 获取空间和空间下的应用
export const GetMySpacesWithApps = async (offset, size) => {
  const mySpaces = await GetMySpacesList(offset, size).catch(() => {})
  const { spaceList, hasMore } = mySpaces
  const promiseArray = spaceList.map((item) => GetSpaceAppsInfo(item.id))
  return Promise.all(promiseArray)
    .then((spaceAppsArray) => {
      return { spaceList: spaceAppsArray, hasMore }
    })
    .catch(() => {})
}

// 获取空间信息
export const GetSpaceInfo = (id) => {
  const body = {
    id,
  }
  return kintone.api(kintone.api.url('/k/v1/space.json', true), 'GET', body)
}

// 获取应用信息
export const GetAppInfo = (appIds) => {
  return kintone.api(kintone.api.url('/k/api/app/list.json'), 'POST', { apps: appIds }).then((resp) => {
    const applist = resp.result.appList
    return applist.map((app) => {
      return {
        appId: app.id,
        appIcon: app.icons.NORMAL,
        appName: app.name,
      }
    })
  })
}

// 获取通知列表
export const GetNoticeList = (prams) => {
  return kintone.api(kintone.api.url('/k/api/ntf/list.json', true), 'POST', prams)
}

// 获取未处理一览
export const GetAssigned = (limit = 20) => {
  const options = { includeGuestInfo: true, size: limit }
  return kintone.api(kintone.api.url('/k/api/app/listAssigned.json', true), 'POST', options)
}

// 批量获取记录
export const GetRecords = (app, query) => {
  const options = {
    app,
    query,
    totalCount: true,
  }
  return kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', options)
}

// 更新值为唯一的指定记录
export const UpdateRecord = (app, updateKey, record) => {
  const body = {
    app,
    updateKey,
    record,
  }

  return kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body)
}

//添加一条记录
export const AddRecord = (app, record) => {
  const body = {
    app,
    record,
  }

  return kintone.api(kintone.api.url('/k/v1/record.json', true), 'POST', body)
}

// 获取收藏的应用
export const GetFavoriteApps = (size) => {
  const options = { includeGuestInfo: true, offset: 0, size }
  return kintone.api(kintone.api.url('/k/api/userFavorite/list.json', true), 'POST', options).then((resp) => {
    return resp.result.apps.map((app) => {
      const { id, name, icons } = app
      return {
        id,
        name,
        icons,
      }
    })
  })
}

// 获取用户及组织
export const GetContacts = () => {
  return kintone.api(kintone.api.url('/k/api/m/people/list.json', true), 'POST', {})
}

// 获取应用布局
export const GetAppViews = (app) => {
  const body = {
    app,
  }
  return kintone.api(kintone.api.url('/k/v1/app/views.json', true), 'GET', body)
}

//获取记录的状态一览
export const GetRecordSteps = (app, record) => {
  const body = {
    app,
    record,
  }
  return kintone.api(kintone.api.url('/k/api/status/getHistory.json', true), 'POST', body)
}

//获取所有应用（暂时100条）
export const GetAppsList = () => {
  const body = {
    excludeUnrelatedApps: true,
    includeCreatorInfo: false,
    includeGuestInfo: true,
    offset: 0,
    size: 100,
  }
  return kintone.api(kintone.api.url('/k/api/app/list.json', true), 'POST', body)
}
