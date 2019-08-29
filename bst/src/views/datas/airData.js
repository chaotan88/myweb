const airs = [
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 15000, // 原价
        offerPrice: 13900, // 优惠价
        name: '东航特惠 商务舱 头等 机票 直飞自由行 接送机服务', // 机票名称
        images: ['1', '2', '3', '4'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面,如果不配置, 默认用['1', '2', '3', '4']
        // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面,如果不配置，默认用['5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
        detais: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 15000, // 原价
        offerPrice: 13900, // 优惠价
        name: '东航特惠 商务舱 头等 机票 直飞自由行 接送机服务', // 机票名称
        images: ['15', '16', '17', '18'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面 注意每个数字唯一
        detais: ['19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '墨尔本', // 出发城市
        to: '悉尼', // 到达城市
        price: 14000, // 原价
        offerPrice: 12200, // 优惠价
        name: '奥克兰往返 商务特惠 自由行', // 机票名称
        images: ['30', '31', '32', '33'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '马尔代夫', // 到达城市
        price: 17000, // 原价
        offerPrice: 15000, // 优惠价
        name: '东航商务舱往返 特惠进行中', // 机票名称
        images: ['45', '46', '47', '48'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['49', '50'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '美联航 全球航司直飞中转单程往返商务舱自由行接送机', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '旧金山', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '东方航空特惠直飞商务舱 自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '广州', // 出发城市
        to: '洛杉矶', // 到达城市
        price: 15600, // 原价
        offerPrice: 15600, // 优惠价
        name: ' 南方航空 商务舱 直飞 自由行 接送机 尊贵旅行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '北京', // 出发城市
        to: '纽约', // 到达城市
        price: 19000, // 原价
        offerPrice: 19000, // 优惠价
        name: '美联航 联合航空 直飞 往返 商务头等舱 自由行',
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '多伦多', // 到达城市
        price: 15500, // 原价
        offerPrice: 15500, // 优惠价
        name: '美联航直飞 机票 中转 往返 商务头等舱预定 接送机', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '北京', // 出发城市
        to: '波士顿', // 到达城市
        price: 19800, // 原价
        offerPrice: 19800, // 优惠价
        name: '海南航空特惠 直飞 商务舱 自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '中国', // 出发城市
        to: '美洲', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '美联航 直飞单程 商务舱自由行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '西雅图', // 到达城市
        price: 19500, // 原价
        offerPrice: 19500, // 优惠价
        name: '达美航空特惠 商务舱自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '墨尔本', // 出发城市
        to: '悉尼', // 到达城市
        price: 12000, // 原价
        offerPrice: 12000, // 优惠价
        name: '奥克兰往返 商务特惠 自由行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '杭州', // 出发城市
        to: '悉尼', // 到达城市
        price: 12000, // 原价
        offerPrice: 12000, // 优惠价
        name: '东方航空 直飞 商务舱 自由行 接送机服务 尊贵体验', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '广州', // 出发城市
        to: '墨尔本', // 到达城市
        price: 12200, // 原价
        offerPrice: 12200, // 优惠价
        name: '南方航空直飞 特惠商务舱 高端出行 接送机', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '上海', // 出发城市
        to: '奥克兰', // 到达城市
        price: 13500, // 原价
        offerPrice: 13500, // 优惠价
        name: '万游商旅 新西兰航空自由行 单程 往返 商务舱', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '北京', // 出发城市
        to: '悉尼', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '商务舱往返 直飞 澳航QF', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '中国', // 出发城市
        to: '悉尼', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '澳航 往返 自由行 国际机票 直飞中转商务舱 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '上海', // 出发城市
        to: '墨尔本', // 到达城市
        price: 12000, // 原价
        offerPrice: 12000, // 优惠价
        name: '东方航空 机票 商务舱 直飞单程 往返 万游商旅', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '澳洲', // 所属洲名
        from: '北京', // 出发城市
        to: '悉尼', // 到达城市
        price: 12200, // 原价
        offerPrice: 12000, // 优惠价
        name: '东方航空 直飞 商务舱 自由行 尊贵接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '莫斯科', // 到达城市
        price: 8000, // 原价
        offerPrice: 8000, // 优惠价
        name: '东方航空 直飞商务舱自由行 接送机服务 尊贵旅行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '马德里', // 到达城市
        price: 14000, // 原价
        offerPrice: 14000, // 优惠价
        name: ' 东方航空高端 商务舱 直飞 自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '慕尼黑', // 到达城市
        price: 19500, // 原价
        offerPrice: 19500, // 优惠价
        name: '汉莎航空 直飞 商务舱 高端 自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '慕尼黑', // 到达城市
        price: 19700, // 原价
        offerPrice: 19700, // 优惠价
        name: '汉莎航空 直飞高端商务舱 自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '法兰克福', // 到达城市
        price: 17000, // 原价
        offerPrice: 17000, // 优惠价
        name: '汉莎航空 直飞 自由行 商务舱 接送机', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '北京', // 出发城市
        to: '法兰克福', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '国际机票汉莎航空 直飞 往返商务舱自由行 接送机', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '巴黎', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '东方航空 直飞商务舱自由行 接送机服务 尊贵旅行体验', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '北京', // 出发城市
        to: '迪拜', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '阿联酋航空 往返直飞 商务舱 自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '青岛', // 出发城市
        to: '法兰克福', // 到达城市
        price: 19800, // 原价
        offerPrice: 19800, // 优惠价
        name: '汉莎航空 直飞商务舱自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '阿姆斯特丹', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '南方航空 直飞 商务舱 高端自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '广州', // 出发城市
        to: '伦敦', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '南方航空 直飞商务舱自由行 尊贵接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '欧洲', // 所属洲名
        from: '上海', // 出发城市
        to: '莫斯科', // 到达城市
        price: 11000, // 原价
        offerPrice: 11000, // 优惠价
        name: '南方航空 特惠 直飞 商务舱 自由行 接送机服务', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '马尔代夫', // 到达城市
        price: 15000, // 原价
        offerPrice: 15000, // 优惠价
        name: '东航商务舱往返 特惠进行中', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '札幌', // 到达城市
        price: 5600, // 原价
        offerPrice: 5600, // 优惠价
        name: '东航特惠商务直飞 往返自由行', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '大阪', // 到达城市
        price: 5200, // 原价
        offerPrice: 5200, // 优惠价
        name: '东航 商务舱 往返直飞 特价', // 机票名称
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: true // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '亚洲', // 所属洲名
        from: '上海', // 出发城市
        to: '东京', // 到达城市
        price: 4980, // 原价
        offerPrice: 4980, // 优惠价
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
