declare namespace API {
  type AddressAddRequest = {
    receiverName?: string
    receiverPhone?: string
    province?: string
    city?: string
    district?: string
    detailAddress?: string
    defaultFlag?: number
  }

  type AddressUpdateRequest = {
    receiverName?: string
    receiverPhone?: string
    province?: string
    city?: string
    district?: string
    detailAddress?: string
    defaultFlag?: number
    id?: string
  }

  type AddressVO = {
    id?: string
    receiverName?: string
    receiverPhone?: string
    province?: string
    city?: string
    district?: string
    detailAddress?: string
    defaultFlag?: number
  }

  type ArticleVO = {
    id?: string
    title?: string
    coverUrl?: string
    summary?: string
    articleType?: string
    sort?: number
  }

  type BannerVO = {
    id?: string
    title?: string
    imageUrl?: string
    linkUrl?: string
    sort?: number
  }

  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
    traceId?: string
  }

  type BaseResponseCartQuoteVO = {
    code?: number
    data?: CartQuoteVO
    message?: string
    traceId?: string
  }

  type BaseResponseFreightQuoteVO = {
    code?: number
    data?: FreightQuoteVO
    message?: string
    traceId?: string
  }

  type BaseResponseHomeVO = {
    code?: number
    data?: HomeVO
    message?: string
    traceId?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: string
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultAddressVO = {
    code?: number
    data?: PageResultAddressVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultCartVO = {
    code?: number
    data?: PageResultCartVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultFavoriteVO = {
    code?: number
    data?: PageResultFavoriteVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultMessageVO = {
    code?: number
    data?: PageResultMessageVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultProductVO = {
    code?: number
    data?: PageResultProductVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultReviewVO = {
    code?: number
    data?: PageResultReviewVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultTradeOrderVO = {
    code?: number
    data?: PageResultTradeOrderVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultUserCouponVO = {
    code?: number
    data?: PageResultUserCouponVO
    message?: string
    traceId?: string
  }

  type BaseResponseProductDetailVO = {
    code?: number
    data?: ProductDetailVO
    message?: string
    traceId?: string
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
    traceId?: string
  }

  type BaseResponseTradeOrderDetailVO = {
    code?: number
    data?: TradeOrderDetailVO
    message?: string
    traceId?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
    traceId?: string
  }

  type CartAddRequest = {
    skuId?: string
    quantity?: number
  }

  type CartCheckRequest = {
    ids?: string[]
    checked?: number
  }

  type CartDeleteRequest = {
    id?: string
    ids?: string[]
  }

  type CartQuoteRequest = {
    addressId?: string
    province?: string
    userCouponId?: string
    useCoupon?: boolean
  }

  type CartQuoteVO = {
    goodsAmount?: number
    freightAmount?: number
    discountAmount?: number
    payAmount?: number
    freeShipping?: boolean
    ruleText?: string
    couponName?: string
    couponId?: string
    checkedCount?: number
  }

  type CartUpdateRequest = {
    id?: string
    quantity?: number
  }

  type CartVO = {
    id?: string
    productId?: string
    skuId?: string
    productName?: string
    skuName?: string
    coverUrl?: string
    priceMode?: string
    salePrice?: number
    quantity?: number
    stock?: number
    checked?: number
    lineAmount?: number
  }

  type CategoryVO = {
    id?: string
    name?: string
    parentId?: string
    sort?: number
    children?: CategoryVO[]
  }

  type DeleteRequest = {
    id?: string
  }

  type FavoriteAddRequest = {
    productId?: string
  }

  type FavoriteVO = {
    id?: string
    productId?: string
    productName?: string
    coverUrl?: string
    price?: number
  }

  type FreightCalcRequest = {
    skuId?: string
    quantity?: number
    province?: string
  }

  type FreightQuoteVO = {
    goodsAmount?: number
    freightAmount?: number
    payAmount?: number
    freeShipping?: boolean
    ruleText?: string
    stock?: number
  }

  type getProductVOByIdParams = {
    id: string
  }

  type getTradeOrderVOByIdParams = {
    id: string
  }

  type HomeVO = {
    bannerList?: BannerVO[]
    categoryList?: CategoryVO[]
    hotList?: ProductVO[]
    newList?: ProductVO[]
    directList?: ProductVO[]
    shelfList?: ProductVO[]
    noticeList?: ArticleVO[]
    newsList?: ArticleVO[]
    originList?: ArticleVO[]
  }

  type MessageReadRequest = {
    id?: string
  }

  type MessageVO = {
    id?: string
    title?: string
    content?: string
    readFlag?: number
    createTime?: string
  }

  type OrderAddRequest = {
    skuId?: string
    quantity?: number
    addressId?: string
    province?: string
    userCouponId?: string
  }

  type OrderIdRequest = {
    id?: string
  }

  type OrderPayRequest = {
    id?: string
    payChannel?: string
    userCouponId?: string
  }

  type OrderRefundRequest = {
    id?: string
    reason?: string
  }

  type PageRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type PageResultAddressVO = {
    list?: AddressVO[]
    total?: string
  }

  type PageResultCartVO = {
    list?: CartVO[]
    total?: string
  }

  type PageResultFavoriteVO = {
    list?: FavoriteVO[]
    total?: string
  }

  type PageResultMessageVO = {
    list?: MessageVO[]
    total?: string
  }

  type PageResultProductVO = {
    list?: ProductVO[]
    total?: string
  }

  type PageResultReviewVO = {
    list?: ReviewVO[]
    total?: string
  }

  type PageResultTradeOrderVO = {
    list?: TradeOrderVO[]
    total?: string
  }

  type PageResultUserCouponVO = {
    list?: UserCouponVO[]
    total?: string
  }

  type ProductDetailVO = {
    id?: string
    name?: string
    coverUrl?: string
    origin?: string
    grade?: string
    fruitDiameter?: string
    netWeight?: string
    pickTime?: string
    freshNote?: string
    detailText?: string
    price?: number
    freightText?: string
    skuList?: ProductSkuVO[]
    traceList?: TraceBatchVO[]
  }

  type ProductQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    keyword?: string
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    hotFlag?: number
    newFlag?: number
    directFlag?: number
  }

  type ProductSkuVO = {
    id?: string
    skuName?: string
    priceMode?: string
    salePrice?: number
    weightJin?: number
    stock?: number
  }

  type ProductVO = {
    id?: string
    categoryId?: string
    name?: string
    coverUrl?: string
    origin?: string
    spec?: string
    price?: number
    hotFlag?: number
    newFlag?: number
    directFlag?: number
  }

  type ReviewAddRequest = {
    orderId?: string
    productId?: string
    content?: string
    score?: number
    imageUrls?: string
  }

  type ReviewQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    productId?: string
  }

  type ReviewVO = {
    id?: string
    productId?: string
    content?: string
    score?: number
    imageUrls?: string
    createTime?: string
  }

  type TraceBatchVO = {
    batchNo?: string
    originPlace?: string
    pickDate?: string
    inspectNote?: string
  }

  type TradeOrderDetailVO = {
    id?: string
    orderNo?: string
    goodsAmount?: number
    freightAmount?: number
    discountAmount?: number
    payAmount?: number
    orderStatus?: string
    payChannel?: string
    payTime?: string
    logisticsNo?: string
    receiverName?: string
    receiverPhone?: string
    province?: string
    city?: string
    district?: string
    detailAddress?: string
    refundStatus?: string
    refundReason?: string
    createTime?: string
    itemList?: TradeOrderItemVO[]
  }

  type TradeOrderItemVO = {
    productId?: string
    skuId?: string
    productName?: string
    skuName?: string
    salePrice?: number
    quantity?: number
    lineAmount?: number
  }

  type TradeOrderVO = {
    id?: string
    orderNo?: string
    goodsAmount?: number
    freightAmount?: number
    discountAmount?: number
    payAmount?: number
    orderStatus?: string
    logisticsNo?: string
    refundStatus?: string
    createTime?: string
  }

  type UserCouponVO = {
    id?: string
    couponId?: string
    couponName?: string
    couponType?: string
    discountAmount?: number
    minAmount?: number
    useStatus?: number
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserRegisterRequest = {
    userAccount?: string
    userPassword?: string
    checkPassword?: string
  }

  type UserResetPasswordRequest = {
    userAccount?: string
    userPhone?: string
    newPassword?: string
    checkPassword?: string
  }

  type UserUpdateRequest = {
    userName?: string
    userAvatar?: string
    userPhone?: string
  }

  type CouponClaimRequest = {
    couponId?: string
  }

  type CouponVO = {
    id?: string
    couponName?: string
    couponType?: string
    discountAmount?: number
    minAmount?: number
    claimed?: boolean
  }

  type PromotionActionRequest = {
    activityId?: string
    teamId?: string
    quantity?: number
  }

  type PromotionActivityVO = {
    id?: string
    activityName?: string
    activityType?: string
    productName?: string
    salePrice?: number
    originPrice?: number
    stock?: number
    groupSize?: number
    minQuantity?: number
  }

  type GroupTeamVO = {
    id?: string
    activityId?: string
    activityName?: string
    productName?: string
    salePrice?: number
    needCount?: number
    joinedCount?: number
    remainCount?: number
    percent?: number
    teamStatus?: string
    leader?: boolean
    sharePath?: string
    memberNames?: string[]
  }

  type MemberVO = {
    pointBalance?: number
    totalSpend?: number
    levelCode?: string
    levelName?: string
    discountRate?: number
    freeFreightAmount?: number
    memberDay?: boolean
    memberDayOff?: number
  }

  type PointLogVO = {
    changeAmount?: number
    reason?: string
    createTime?: string
  }

  type PointRedeemRequest = {
    points?: number
  }

  type BaseResponseCouponVOPage = {
    code?: number
    data?: { list?: CouponVO[]; total?: number | string }
    message?: string
  }

  type BaseResponsePromotionPage = {
    code?: number
    data?: { list?: PromotionActivityVO[]; total?: number | string }
    message?: string
  }

  type BaseResponseGroupPage = {
    code?: number
    data?: { list?: GroupTeamVO[]; total?: number | string }
    message?: string
  }

  type BaseResponseGroupTeamVO = {
    code?: number
    data?: GroupTeamVO
    message?: string
  }

  type BaseResponseMemberVO = {
    code?: number
    data?: MemberVO
    message?: string
  }

  type UserVO = {
    id?: string
    userAccount?: string
    userName?: string
    userAvatar?: string
    userPhone?: string
    userRole?: string
  }
}
