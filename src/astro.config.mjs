// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'MiCake 文档',
			logo: {
				src: './src/assets/houston.webp',
			},
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/MiCake/MiCake' }
			],
			editLink: {
				baseUrl: 'https://github.com/MiCake/MiCakeDoc/edit/main/src/',
			},
			customCss: [
				'./src/styles/custom.css',
			],
			expressiveCode: {
				themes: ['github-dark', 'github-light'],
				styleOverrides: {
					borderRadius: '0.5rem',
					borderWidth: '2px',
				},
			},
			sidebar: [
				{
					label: '开始使用',
					items: [
						{ label: 'MiCake 简介', slug: 'getting-started/introduction' },
						{ label: '快速开始', slug: 'getting-started/quick-start' },
						{ label: '核心概念', slug: 'getting-started/core-concepts' },
					],
				},
				{
					label: '领域驱动设计',
					items: [
						{ label: '实体', slug: 'domain-driven/entity' },
						{ label: '值对象', slug: 'domain-driven/value-object' },
						{ label: '聚合根', slug: 'domain-driven/aggregate-root' },
						{ label: '仓储', slug: 'domain-driven/repository' },
						{ label: '领域事件', slug: 'domain-driven/domain-event' },
						{ label: '领域服务', slug: 'domain-driven/domain-service' },
						{ label: '工作单元', slug: 'domain-driven/unit-of-work' },
					],
				},
				{
					label: '模块化',
					items: [
						{ label: '模块使用', slug: 'modularity/module-usage' },
					],
				},
				{
					label: '依赖注入',
					slug: 'dependency-injection',
				},
				{
					label: '异常处理',
					slug: 'exception',
				},
				{
					label: '统一返回',
					items: [
						{ label: '统一返回格式', slug: 'unified-response/overview' },
					],
				},
				{
					label: '自动审计',
					slug: 'audit',
				},
				{
					label: '软删除支持',
					slug: 'soft-delete',
				},
				{
					label: '工具集',
					items: [
						{ label: '工具集概览', slug: 'utilities/overview' },
						{
							label: '缓存',
							items: [
								{ label: 'BoundedLruCache', slug: 'utilities/cache/bounded-lru-cache' },
							],
						},
						{ label: '类型转换', slug: 'utilities/converter' },
						{ label: '动态查询', slug: 'utilities/query' },
						{ label: '熔断器', slug: 'utilities/resilience' },
						{ label: '数据存储池', slug: 'utilities/storage' },
					],
				},
			],
		}),
	],
});
