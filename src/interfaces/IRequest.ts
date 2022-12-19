export default interface IRequest {
    url: string
    width?: number
    height?: number
    /** 模拟设备 */
    device?: string
}