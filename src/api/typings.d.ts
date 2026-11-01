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

  type AdminQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    keyword?: string
    userRole?: string
    userStatus?: number
    auditStatus?: string
    shopStatus?: number
    articleType?: string
    publishStatus?: number
    dictCode?: string
    successFlag?: number
    parentId?: string
    categoryId?: string
    shelfStatus?: number
    specType?: string
  }

  type Article = {
    id?: string
    title?: string
    coverUrl?: string
    summary?: string
    content?: string
    articleType?: string
    sort?: number
    publishStatus?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type ArticleVO = {
    id?: string
    title?: string
    coverUrl?: string
    summary?: string
    articleType?: string
    sort?: number
  }

  type Banner = {
    id?: string
    title?: string
    imageUrl?: string
    linkUrl?: string
    sort?: number
    publishStatus?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
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

  type BaseResponseGroupTeamVO = {
    code?: number
    data?: GroupTeamVO
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

  type BaseResponseMemberVO = {
    code?: number
    data?: MemberVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultAddressVO = {
    code?: number
    data?: PageResultAddressVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultArticle = {
    code?: number
    data?: PageResultArticle
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultBanner = {
    code?: number
    data?: PageResultBanner
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultCartVO = {
    code?: number
    data?: PageResultCartVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultCategoryVO = {
    code?: number
    data?: PageResultCategoryVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultCouponVO = {
    code?: number
    data?: PageResultCouponVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultDictItem = {
    code?: number
    data?: PageResultDictItem
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultFavoriteVO = {
    code?: number
    data?: PageResultFavoriteVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultFreightRuleVO = {
    code?: number
    data?: PageResultFreightRuleVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultGroupTeamVO = {
    code?: number
    data?: PageResultGroupTeamVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultMerchantVO = {
    code?: number
    data?: PageResultMerchantVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultMessageVO = {
    code?: number
    data?: PageResultMessageVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultOperateLog = {
    code?: number
    data?: PageResultOperateLog
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultPaymentFlowVO = {
    code?: number
    data?: PageResultPaymentFlowVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultPointLogVO = {
    code?: number
    data?: PageResultPointLogVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultPresaleActivityVO = {
    code?: number
    data?: PageResultPresaleActivityVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultPresaleOrderVO = {
    code?: number
    data?: PageResultPresaleOrderVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultProduct = {
    code?: number
    data?: PageResultProduct
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultProductSpec = {
    code?: number
    data?: PageResultProductSpec
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultProductVO = {
    code?: number
    data?: PageResultProductVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultPromotionActivityVO = {
    code?: number
    data?: PageResultPromotionActivityVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultRefundOrderVO = {
    code?: number
    data?: PageResultRefundOrderVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultReviewVO = {
    code?: number
    data?: PageResultReviewVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultTradeOrderAdminVO = {
    code?: number
    data?: PageResultTradeOrderAdminVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultTradeOrderVO = {
    code?: number
    data?: PageResultTradeOrderVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultUploadFile = {
    code?: number
    data?: PageResultUploadFile
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultUserCouponVO = {
    code?: number
    data?: PageResultUserCouponVO
    message?: string
    traceId?: string
  }

  type BaseResponsePageResultUserVO = {
    code?: number
    data?: PageResultUserVO
    message?: string
    traceId?: string
  }

  type BaseResponsePresaleOrderDetailVO = {
    code?: number
    data?: PresaleOrderDetailVO
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

  type Category = {
    id?: string
    name?: string
    parentId?: string
    sort?: number
    publishStatus?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type CategoryVO = {
    id?: string
    name?: string
    parentId?: string
    sort?: number
    publishStatus?: number
    parentName?: string
    children?: CategoryVO[]
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

  type DeleteRequest = {
    id?: string
  }

  type DictItem = {
    id?: string
    dictCode?: string
    itemName?: string
    itemValue?: string
    sort?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type exportTradeOrderParams = {
    queryRequest: TradeOrderAdminQueryRequest
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

  type FreightQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    ruleName?: string
  }

  type FreightQuoteVO = {
    goodsAmount?: number
    freightAmount?: number
    payAmount?: number
    freeShipping?: boolean
    ruleText?: string
    stock?: number
  }

  type FreightRuleVO = {
    id?: string
    ruleName?: string
    inProvinceFee?: number
    outProvinceFee?: number
    freeAmount?: number
    createTime?: string
  }

  type FreightSaveRequest = {
    id?: string
    ruleName?: string
    inProvinceFee?: number
    outProvinceFee?: number
    freeAmount?: number
  }

  type getGroupVOParams = {
    id: string
  }

  type getPresaleOrderVOByIdParams = {
    id: string
  }

  type getProductVOByIdParams = {
    id: string
  }

  type getTradeOrderVOByIdParams = {
    id: string
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

  type Merchant = {
    id?: string
    userId?: string
    shopName?: string
    licenseNo?: string
    originProof?: string
    auditStatus?: string
    auditNote?: string
    shopStatus?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type MerchantVO = {
    id?: string
    userId?: string
    userAccount?: string
    userName?: string
    userPhone?: string
    shopName?: string
    licenseNo?: string
    originProof?: string
    auditStatus?: string
    auditNote?: string
    shopStatus?: number
    createTime?: string
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

  type OperateLog = {
    id?: string
    userId?: string
    userAccount?: string
    actionName?: string
    successFlag?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
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

  type PageResultArticle = {
    list?: Article[]
    total?: string
  }

  type PageResultBanner = {
    list?: Banner[]
    total?: string
  }

  type PageResultCartVO = {
    list?: CartVO[]
    total?: string
  }

  type PageResultCategoryVO = {
    list?: CategoryVO[]
    total?: string
  }

  type PageResultCouponVO = {
    list?: CouponVO[]
    total?: string
  }

  type PageResultDictItem = {
    list?: DictItem[]
    total?: string
  }

  type PageResultFavoriteVO = {
    list?: FavoriteVO[]
    total?: string
  }

  type PageResultFreightRuleVO = {
    list?: FreightRuleVO[]
    total?: string
  }

  type PageResultGroupTeamVO = {
    list?: GroupTeamVO[]
    total?: string
  }

  type PageResultMerchantVO = {
    list?: MerchantVO[]
    total?: string
  }

  type PageResultMessageVO = {
    list?: MessageVO[]
    total?: string
  }

  type PageResultOperateLog = {
    list?: OperateLog[]
    total?: string
  }

  type PageResultPaymentFlowVO = {
    list?: PaymentFlowVO[]
    total?: string
  }

  type PageResultPointLogVO = {
    list?: PointLogVO[]
    total?: string
  }

  type PageResultPresaleActivityVO = {
    list?: PresaleActivityVO[]
    total?: string
  }

  type PageResultPresaleOrderVO = {
    list?: PresaleOrderVO[]
    total?: string
  }

  type PageResultProduct = {
    list?: Product[]
    total?: string
  }

  type PageResultProductSpec = {
    list?: ProductSpec[]
    total?: string
  }

  type PageResultProductVO = {
    list?: ProductVO[]
    total?: string
  }

  type PageResultPromotionActivityVO = {
    list?: PromotionActivityVO[]
    total?: string
  }

  type PageResultRefundOrderVO = {
    list?: RefundOrderVO[]
    total?: string
  }

  type PageResultReviewVO = {
    list?: ReviewVO[]
    total?: string
  }

  type PageResultTradeOrderAdminVO = {
    list?: TradeOrderAdminVO[]
    total?: string
  }

  type PageResultTradeOrderVO = {
    list?: TradeOrderVO[]
    total?: string
  }

  type PageResultUploadFile = {
    list?: UploadFile[]
    total?: string
  }

  type PageResultUserCouponVO = {
    list?: UserCouponVO[]
    total?: string
  }

  type PageResultUserVO = {
    list?: UserVO[]
    total?: string
  }

  type PaymentFlowQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    orderId?: string
    orderType?: string
    bizType?: string
    payStatus?: string
    createTimeStart?: string
    createTimeEnd?: string
  }

  type PaymentFlowVO = {
    id?: string
    flowNo?: string
    userId?: string
    orderId?: string
    orderType?: string
    bizType?: string
    amount?: number
    payChannel?: string
    payStatus?: string
    payTime?: string
  }

  type PointLogVO = {
    changeAmount?: number
    reason?: string
    createTime?: string
  }

  type PointRedeemRequest = {
    points?: number
  }

  type PresaleActivityQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    title?: string
    productId?: string
  }

  type PresaleActivitySaveRequest = {
    id?: string
    productId?: string
    title?: string
    openPickDate?: string
    expectShipDate?: string
    depositRatio?: number
    totalStock?: number
    depositDeadline?: string
    balanceDeadline?: string
  }

  type PresaleActivityVO = {
    id?: string
    productId?: string
    productName?: string
    title?: string
    openPickDate?: string
    expectShipDate?: string
    depositRatio?: number
    totalStock?: number
    soldStock?: number
    remainStock?: number
    depositDeadline?: string
    balanceDeadline?: string
    status?: number
  }

  type PresaleOrderAddRequest = {
    presaleActivityId?: string
    quantity?: number
    addressId?: string
  }

  type PresaleOrderDetailVO = {
    id?: string
    presaleActivityId?: string
    activityTitle?: string
    orderNo?: string
    quantity?: number
    totalAmount?: number
    depositAmount?: number
    balanceAmount?: number
    presaleStatus?: string
    depositPaidTime?: string
    balancePaidTime?: string
    addressId?: string
    depositForfeit?: number
    closeRemark?: string
    createTime?: string
    flowList?: PaymentFlowVO[]
  }

  type PresaleOrderVO = {
    id?: string
    presaleActivityId?: string
    activityTitle?: string
    orderNo?: string
    quantity?: number
    totalAmount?: number
    depositAmount?: number
    balanceAmount?: number
    presaleStatus?: string
    depositPaidTime?: string
    balancePaidTime?: string
    addressId?: string
    depositForfeit?: number
    closeRemark?: string
    createTime?: string
  }

  type PresalePayRequest = {
    id?: string
    payChannel?: string
  }

  type Product = {
    id?: string
    categoryId?: string
    name?: string
    coverUrl?: string
    origin?: string
    spec?: string
    price?: number
    grade?: string
    fruitDiameter?: string
    netWeight?: string
    pickTime?: string
    freshNote?: string
    detailText?: string
    hotFlag?: number
    hotSort?: number
    newFlag?: number
    newSort?: number
    directFlag?: number
    directSort?: number
    shelfStatus?: number
    auditStatus?: string
    auditNote?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type ProductAddRequest = {
    categoryId?: string
    name?: string
    coverUrl?: string
    origin?: string
    spec?: string
    price?: number
    grade?: string
    fruitDiameter?: string
    netWeight?: string
    pickTime?: string
    freshNote?: string
    detailText?: string
    priceMode?: string
    stock?: number
    hotFlag?: number
    newFlag?: number
    directFlag?: number
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

  type ProductSpec = {
    id?: string
    specType?: string
    specName?: string
    specValue?: string
    sort?: number
    publishStatus?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
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

  type RefundAuditRequest = {
    refundId?: string
    pass?: boolean
    auditRemark?: string
  }

  type RefundOrderQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    refundStatus?: string
    orderNo?: string
    createTimeStart?: string
    createTimeEnd?: string
  }

  type RefundOrderVO = {
    id?: string
    orderId?: string
    orderNo?: string
    refundNo?: string
    userId?: string
    userName?: string
    refundAmount?: number
    refundReason?: string
    refundStatus?: string
    auditUserId?: string
    auditTime?: string
    auditRemark?: string
    createTime?: string
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

  type TradeOrderAdminQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    orderNo?: string
    receiverPhone?: string
    receiverName?: string
    orderStatus?: string[]
    refundStatus?: string
    payChannel?: string
    minPayAmount?: number
    maxPayAmount?: number
    createTimeStart?: string
    createTimeEnd?: string
  }

  type TradeOrderAdminVO = {
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
    userName?: string
    receiverName?: string
    receiverPhone?: string
    payChannel?: string
    payTime?: string
    itemCount?: number
    refundNo?: string
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

  type UploadFile = {
    id?: string
    userId?: string
    fileName?: string
    fileUrl?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type uploadFileParams = {
    folder?: string
  }

  type UserAdminRequest = {
    id?: string
    userName?: string
    userAvatar?: string
    userPhone?: string
    userStatus?: number
    userRole?: string
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

  type UserVO = {
    id?: string
    userAccount?: string
    userName?: string
    userAvatar?: string
    userPhone?: string
    userRole?: string
    userStatus?: number
    createTime?: string
  }
}
