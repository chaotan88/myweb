const airs = [
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 15000, // 原价
        offerPrice: 13900, // 优惠价
        name: '东航特惠 商务舱 头等 机票 直飞自由行 接送机服务', // 机票名称
        images: ['1', '2', '3'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: true, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: false // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
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
        islandRecommend: false // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
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
        islandRecommend: false // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
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
        islandRecommend: false // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '纽约', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '美联航 全球航司直飞中转单程往返商务舱自由行接送机', // 机票名称
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
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
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
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
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
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
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
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
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
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
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
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
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: false // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
    },
    {
        island: '美洲', // 所属洲名
        from: '上海', // 出发城市
        to: '旧金山', // 到达城市
        price: 15888, // 原价
        offerPrice: 15888, // 优惠价
        name: '东方航空特惠直飞商务舱 自由行 接送机服务', // 机票名称
        images: ['51', '52', '53', '54'], // 轮播图 1代表 1.jpg 图片目录在/static/images/airImage下面
        detais: ['55', '56', '57', '58', '59', '60', '61', '62', '63', '64'], // 详情图 1代表 1.jpg 图片目录在/static/images/airImage下面
        isHot: false, // 是否为热门, 若为true 则展示在首页限时优惠栏目,
        islandRecommend: false // 是否所属洲推荐产品,若为true 则展示在对应洲的首页栏目中
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
