const ADSRV_URL = 'https://s.adtelligent.com/'

function formatUrl(url, params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, (value))
    }

    return `${url}?${searchParams.toString()}`
}


export function getAdUrl(params) {
    if (!params.aid || !params.width || !params.height) throw new Error('aid & width & height params are required')
    return formatUrl(ADSRV_URL, {
        ...{
            // env defaults
            content_page_url: location.href, // consider using from iframe, utilize ancestorOrigins if needed
            cb: Date.now(), // cache buster
        },
        ...params,
    })
}

function formatAdBreak(adConfig, i) {
    const url = getAdUrl(adConfig);
    return `
            <vmap:AdBreak 
                timeOffset="${adConfig.timeOffset || 'start'}" 
                breakType="${adConfig.breakType || 'linear'}">
                <vmap:AdSource 
                    id="${i}" 
                    allowMultipleAds="${adConfig.allowMultipleAds || 'true'}">
                    <vmap:AdTagURI templateType="vast3"><![CDATA[${url}]]></vmap:AdTagURI>
                </vmap:AdSource>
            </vmap:AdBreak>
        `
}

export function getVmapXml(adsConfig) {
    const adBreakXmlStrArr = adsConfig.map(formatAdBreak)

    return `<vmap:VMAP xmlns:vmap="//www.iab.net/vmap-1.0" version="1.0"> 
          ${adBreakXmlStrArr.join('')}
</vmap:VMAP>`
}

