import ReactMarkdown from 'react-markdown'

export const Markdown = ({ markdown }: { markdown: string }) => {
	return (
		<ReactMarkdown
			className='flex w-full flex-col gap-4'
			components={{
				p: ({ children }) => (
					<p className='text-[15px] leading-relaxed break-all'>{children}</p>
				),
				h1: ({ children }) => (
					<h1 className='border-b border-border-secondary pb-[.3em] text-[2em] leading-tight'>
						{children}
					</h1>
				),
				h2: ({ children }) => (
					<h2 className='border-b border-border-secondary pb-[.3em] text-[1.5em] leading-tight'>
						{children}
					</h2>
				),
				h3: ({ children }) => (
					<h3 className='text-[1.25em] leading-tight'>{children}</h3>
				),
				h4: ({ children }) => (
					<h4 className='text-[1em] leading-tight'>{children}</h4>
				),
				h5: ({ children }) => (
					<h5 className='text-[.875em] leading-tight'>{children}</h5>
				),
				h6: ({ children }) => (
					<h6 className='text-[.85em] leading-tight'>{children}</h6>
				),
				ol: ({ children }) => {
					return (
						<ol className='counter-reset w-full list-inside list-none space-y-4 [&>li>p]:leading-[26px] [&>li]:w-full [&>li]:list-none [&>li]:rounded-md [&>li]:border [&>li]:border-border-secondary [&>li]:bg-card-secondary [&>li]:px-4 [&>li]:py-5 [&>li]:text-lg [&>li]:font-bold [&>li]:text-muted-foreground'>
							{children}
						</ol>
					)
				},
				ul: ({ children }) => (
					<ul className='mt-3 list-inside list-none space-y-3'>{children}</ul>
				),
				li: ({ children }) => (
					<li className='flex [&>ul>li]:text-base [&>ul>li]:font-medium [&>ul>li]:text-muted-foreground [&>ul]:w-full'>
						<div className='txt-inherit flex flex-col justify-center text-inherit'>
							{children}
						</div>
					</li>
				),
				a: ({ children, href }) => (
					<a
						target='_blank'
						rel='noopener noreferrer'
						href={href}
						className='break-all underline'
					>
						{children}
					</a>
				),
				code: ({ children }) => (
					<code className='rounded-[6px] bg-[#6e768166] p-1 text-[85%]'>
						{children}
					</code>
				),
				pre: ({ children }) => {
					const content = (
						children as {
							props?: {
								children?: string
							}
						}
					).props?.children

					return (
						<div className='relative my-2 overflow-auto'>
							<pre className='block min-h-[52px] overflow-x-auto rounded-[6px] bg-[#161b22] px-4 pb-2 pt-8 text-[85%] leading-[1.45]'>
								{content ?? ''}
							</pre>
						</div>
					)
				},
			}}
		>
			{markdown}
		</ReactMarkdown>
	)
}
