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

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
    traceId?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
    traceId?: string
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

  type HomeVO = {
    bannerList?: BannerVO[]
    categoryList?: CategoryVO[]
    hotList?: ProductVO[]
    newList?: ProductVO[]
    directList?: ProductVO[]
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

  type ReviewVO = {
    id?: string
    productId?: string
    content?: string
    score?: number
    createTime?: string
  }

  type TradeOrderVO = {
    id?: string
    orderNo?: string
    payAmount?: number
    orderStatus?: string
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

  type UserVO = {
    id?: string
    userAccount?: string
    userName?: string
    userAvatar?: string
    userPhone?: string
    userRole?: string
  }
}
