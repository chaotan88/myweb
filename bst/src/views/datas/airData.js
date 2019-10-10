const airs = [
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 19888, // 原价
        offerPrice: 16888, // 优惠价
        name: '东航特惠 头等舱 机票 单程直飞自由行  ', // 机票名称
        images: ['52'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面,如果不配置, 默认用['1', '2', '3', '4']
        // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面,如果不配置，默认用['5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
        detais: ['niuyue'],
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 10888, // 原价
        offerPrice: 9788, // 优惠价
        name: '东航特惠 商务舱  机票 直飞单程自由行  ', // 机票名称
        images: ['49'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面 注意每个数字唯一
        detais: ['niuyue'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '上海', // 出发城市
        to: '悉尼', // 到达城市
        price: 14000, // 原价
        offerPrice: 12800, // 优惠价
        name: '南航特惠 商务特惠 直飞单程自由行', // 机票名称
        images: ['31', '32', '33'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['moerben', 'xini'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '马尔代夫', // 到达城市
        price: 17000, // 原价
        offerPrice: 11900, // 优惠价
        name: '东航商务舱往返 特惠进行中', // 机票名称
        images: ['46', '47', '48'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['49', '50'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 19888, // 原价
        offerPrice: 16888, // 优惠价
        name: '美联航 全球航司直飞往返商务舱自由行  ', // 机票名称
        images: ['49'],
        detais: ['niuyue'],
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '旧金山', // 到达城市
        price: 15888, // 原价
        offerPrice: 9788, // 优惠价
        images: ['50'],
        detais: ['jiujinshan'],
        name: '东方航空特惠直飞商务舱 单程自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '广州', // 出发城市
        to: '洛杉矶', // 到达城市
        price: 19600, // 原价
        offerPrice: 16888, // 优惠价
        images: ['51'],
        detais: ['luoshanji'],
        name: ' 南方航空 商务舱 直飞 往返自由行    尊贵旅行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '北京', // 出发城市
        to: '纽约', // 到达城市
        price: 25000, // 原价
        offerPrice: 17800, // 优惠价
        images: ['52'],
        detais: ['niuyue'],
        name: '美联航 联合航空 直飞 往返 商务舱 自由行',
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '多伦多', // 到达城市
        price: 12500, // 原价
        offerPrice: 9688, // 优惠价
        images: ['53'],
        detais: ['duolunduo'],
        name: '美联航直飞 机票 单程商务舱预定   ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '北京', // 出发城市
        to: '波士顿', // 到达城市
        price: 22800, // 原价
        offerPrice: 17800, // 优惠价
        images: ['54'],
        detais: ['boshidun'],
        name: '中国航空特惠 直飞 商务舱 往返自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '广州', // 出发城市
        to: '多伦多', // 到达城市
        price: 54888, // 原价
        offerPrice: 29988, // 优惠价
        images: ['55'],
        name: '南航 直飞往返 头等舱自由行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '芝加哥', // 到达城市
        price: 15500, // 原价
        offerPrice: 9850, // 优惠价
        images: ['56'],
        name: '达美航空特惠 商务舱单程自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '广州', // 出发城市
        to: '悉尼', // 到达城市
        price: 12000, // 原价
        offerPrice: 7200, // 优惠价
        images: ['57'],
        detais: ['moerben', 'xini'],
        name: '南航单程 商务特惠 自由行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '北京', // 出发城市
        to: '悉尼', // 到达城市
        price: 18000, // 原价
        offerPrice: 12888, // 优惠价
        images: ['58'],
        detais: ['xini'],
        name: '中国航空 直飞 商务舱 往返自由行   尊贵体验', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '广州', // 出发城市
        to: '墨尔本', // 到达城市
        price: 14200, // 原价
        offerPrice: 10988, // 优惠价
        images: ['59'],
        detais: ['moerben'],
        name: '南方航空直飞 特惠商务舱 往返高端出行   ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '上海', // 出发城市
        to: '奥克兰', // 到达城市
        price: 18500, // 原价
        offerPrice: 14100, // 优惠价
        images: ['60'],
        detais: ['aokelan'],
        name: '贝斯特商旅 新西兰航空自由行  往返 商务舱', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '北京', // 出发城市
        to: '悉尼', // 到达城市
        price: 11575, // 原价
        offerPrice: 7990, // 优惠价
        images: ['61'],
        detais: ['xini'],
        name: '商务舱单程 直飞 澳航QF', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '广州', // 出发城市
        to: '悉尼', // 到达城市
        price: 17888, // 原价
        offerPrice: 10988, // 优惠价
        images: ['62'],
        detais: ['xini'],
        name: '南航 往返 自由行 国际机票 直飞商务舱  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '上海', // 出发城市
        to: '阿德莱德', // 到达城市
        price: 15700, // 原价
        offerPrice: 12888, // 优惠价
        images: ['63'],
        detais: ['muerben'],
        name: '东方航空 机票 商务舱 直飞往返 贝斯特商旅', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '北京', // 出发城市
        to: '布里斯班', // 到达城市
        price: 12200, // 原价
        offerPrice: 7888, // 优惠价
        images: ['64'],
        detais: ['xini'],
        name: '东方航空 直飞 商务舱 单程自由行 尊贵 ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '广州', // 出发城市
        to: '巴黎', // 到达城市
        price: 22500, // 原价
        offerPrice: 17988, // 优惠价
        images: ['65'],
        name: '东方航空 直飞往返商务舱自由行   尊贵旅行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '马德里', // 到达城市
        price: 14000, // 原价
        offerPrice: 9998, // 优惠价
        images: ['66'],
        detais: ['madeli'],
        name: ' 东方航空高端 商务舱 单程直飞 自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '慕尼黑', // 到达城市
        price: 21500, // 原价
        offerPrice: 17900, // 优惠价
        images: ['59'],
        detais: ['munihei'],
        name: '汉莎航空 直飞 商务舱往返 高端 自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '广州', // 出发城市
        to: '慕尼黑', // 到达城市
        price: 13700, // 原价
        offerPrice: 9180, // 优惠价
        images: ['56'],
        detais: ['munihei'],
        name: '南方航空 直飞高端商务舱 单程自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '法兰克福', // 到达城市
        price: 22000, // 原价
        offerPrice: 17880, // 优惠价
        images: ['69'],
        detais: ['falankefu'],
        name: '东方航空 直飞 自由行 往返商务舱   ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '北京', // 出发城市
        to: '法兰克福', // 到达城市
        price: 22788, // 原价
        offerPrice: 17988, // 优惠价
        images: ['70'],
        detais: ['falankefu'],
        name: '国际机票中国航空 直飞 往返商务舱自由行   ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '巴黎', // 到达城市
        price: 19888, // 原价
        offerPrice: 15888, // 优惠价
        images: ['71'],
        detais: ['bali'],
        name: '东方航空 直飞商务舱往返自由行   尊贵旅行体验', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '北京', // 出发城市
        to: '迪拜', // 到达城市
        price: 20888, // 原价
        offerPrice: 17888, // 优惠价
        images: ['72'],
        detais: ['dibai'],
        name: '阿联酋航空 往返直飞 商务舱往返 自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '北京', // 出发城市
        to: '伦敦', // 到达城市
        price: 20800, // 原价
        offerPrice: 17800, // 优惠价
        images: ['73'],
        name: '中国航空 直飞商务舱往返自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '马德里', // 到达城市
        price: 21888, // 原价
        offerPrice: 17938, // 优惠价
        images: ['74'],
        name: '东方航空 直飞 商务舱往返 高端自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '广州', // 出发城市
        to: '伦敦', // 到达城市
        price: 12988, // 原价
        offerPrice: 9250, // 优惠价
        images: ['75'],
        detais: ['lundun'],
        name: '南方航空 直飞商务舱单程自由行 尊贵 ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '柏林', // 到达城市
        price: 12800, // 原价
        offerPrice: 9987, // 优惠价
        images: ['76'],
        name: '南方航空 特惠 直飞单程 商务舱 自由行  ', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '马尔代夫', // 到达城市
        price: 15000, // 原价
        offerPrice: 11500, // 优惠价
        images: ['77'],
        name: '东航商务舱往返 特惠进行中', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '广州', // 出发城市
        to: '东京', // 到达城市
        price: 8600, // 原价
        offerPrice: 5600, // 优惠价
        images: ['78'],
        name: '南航特惠商务直飞 往返自由行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '北京', // 出发城市
        to: '新加坡', // 到达城市
        price: 6200, // 原价
        offerPrice: 4800, // 优惠价
        images: ['79'],
        name: '国航 商务舱 单程直飞 特价', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '东京', // 到达城市
        price: 7980, // 原价
        offerPrice: 5980, // 优惠价
        images: ['80'],
        detais: ['dongjing'],
        name: '东方航空往返商务舱 自由行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    }
    
]

const citys = [
    {
        island: '美洲',
        citys: ['纽约',
        '温哥华',
        '旧金山',
        '洛杉矶',
        '多伦多',
        '美洲',
        '美国',
        '加拿大',
        '芝加哥',
        '达拉斯',
        '波士顿',
        '西雅图',
        '底特律',
        '夏威夷',
        '拉斯维加斯']
    },
    {
        island: '澳洲',
        citys: ['新西兰',
            '墨尔本',
            '悉尼',
            '奥克兰',
            '澳洲']
    },
    {
        island: '欧洲',
        citys: [
            '巴黎',
            '法兰克福',
            '罗马',
            '阿姆斯特丹',
            '伦敦',
            '米兰',
            '欧洲',
            '德国',
            '迪拜',
            '圣何塞',
            '曼彻斯特',
            '莫斯科',
            '慕尼黑',
            '马德里',
        ]
    },
    {
        island: '亚洲',
        citys: ['日本','马尔代夫']
    }
]
export {
    airs,
    citys
}
