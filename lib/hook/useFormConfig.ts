import { createTextVNode, h, SetupContext } from 'vue'
import {
	CustomCssType,
	DefaultDataType,
	EpFormDefaultExpose,
	PickFormItemExpose,
	Props,
	ReturnNodeType,
	ShowColumnItem
} from '../type'
import { FormItemContext } from 'element-plus'

/**
 * 定义表单配置
 * @param props 组件属性
 * @param columnsList 显示配置
 * @param slots 插槽
 * @returns
 */
export const useFormConfig = <DataType = DefaultDataType>(
	props: Props<DataType>,
	columnsList: ComputedRef<ShowColumnItem<DataType>[]>,
	slots: SetupContext['slots']
) => {
	/**
	 * 表单ref
	 */
	const formRef = ref<EpFormDefaultExpose>()

	/**
	 * 表单项配置ref
	 */
	const formItemRef = ref<Record<string, PickFormItemExpose>>({})

	/**
	 * 设置动态formItem实例ref
	 * @param v formItem方法实例
	 * @param prop columns配置属性
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const _onDynamicRef = (v: any, prop: ShowColumnItem<DataType>['prop']) => {
		formItemRef.value[`${prop as string}FormItemRef`] = v as PickFormItemExpose
	}

	/**
	 * 计算是否有自定义formItem error插槽
	 */
	const errorRuleCustomList = computed(() => {
		const formRules = props.formProps!.rules || {}
		return columnsList.value.reduce<string[]>((_merge, { required, rules, prop }) => {
			const _rule = formRules[prop as string]

			if (
				slots[`${prop as string}-error-item`] &&
				(required === true || (rules && rules.length) || (_rule && _rule.length))
			) {
				_merge.push(prop as string)
			}
			return _merge
		}, [])
	})

	/**
	 * 计算是否有自定义formItem label插槽
	 */
	const labelCustomList = computed(() => {
		return columnsList.value.reduce<string[]>((_merge, { prop }) => {
			if (slots[`${prop as string}-label-item`]) {
				_merge.push(prop as string)
			}
			return _merge
		}, [])
	})

	/**
	 * 自定义渲染slot转换函数
	 * @param renderInfo 渲染组件信息
	 */
	const _renderFn = (renderInfo: ReturnNodeType) => {
		if (typeof renderInfo === 'object') {
			return h(renderInfo)
		} else {
			return createTextVNode(renderInfo)
		}
	}

	return {
		/**
		 * 表单ref
		 */
		formRef,
		/**
		 * 表单项配置ref
		 */
		formItemRef,
		/**
		 * 设置动态formItem实例ref
		 * @param v formItem方法实例
		 * @param prop columns配置属性
		 */
		_onDynamicRef,
		/**
		 * 计算是否有自定义formItem error插槽
		 */
		errorRuleCustomList,
		/**
		 * 计算是否有自定义formItem label插槽
		 */
		labelCustomList,
		/**
		 * 自定义渲染slot转换函数
		 * @param renderInfo 渲染组件信息
		 */
		_renderFn,
		/**
		 * 提取formItem属性配置
		 * @param item 显示表单项
		 */
		_itemProps: (item: ShowColumnItem<DataType>): Partial<FormItemContext> => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { col, order, show, renderType, format, render, labelRender, errorRender, ...rest } = item
			return rest as Partial<FormItemContext & CustomCssType>
		}
	}
}
