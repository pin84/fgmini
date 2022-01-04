/**
 * 组件生命周期相关信息参考
 * https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html
 */
const e = {
    behaviors: [],
    pageLifetimes: {
        // 组件所在的页面被展示时执行
        show() {
            console.log('Behavior => lifecycle => pageLifetimes => show...')
        },
        // 组件所在的页面被隐藏时执行
        hide() {
            console.log('Behavior => lifecycle => pageLifetimes => hide...')
        },
        // 组件所在的页面尺寸变化时执行
        resize() {
            console.log('Behavior => lifecycle => pageLifetimes => resize...')
        }
    },
    // 在组件实例刚刚被创建时执行
    created() {
        console.log('Behavior => lifecycle => created...')
        this.setData({ msg: 'This information comes from behavior lifecycle.js' })
    },
    // 在组件实例进入页面节点树时执行
    attached() {
        console.log('Behavior => lifecycle => attached...')
    },
    // 在组件在视图层布局完成后执行
    ready() {
        console.log('Behavior => lifecycle => ready...')
    },
    // 在组件实例被移动到节点树另一个位置时执行
    moved() {
        console.log('Behavior => lifecycle => moved...')
    },
    // 在组件实例被从页面节点树移除时执行
    detached() {
        console.log('Behavior => lifecycle => detached...')
    }
}
module.exports = Behavior(e)