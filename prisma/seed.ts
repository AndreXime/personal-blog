import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
	// Create a test user (author)
	const user = await prisma.user.upsert({
		where: { email: 'john@example.com' },
		update: {
			name: 'John Doe',
			role: 'admin',
			password: await hash('senha123'),
			bio: 'Escritor, desenvolvedor e entusiasta de tecnologia com mais de 10 anos de experiência no setor de tecnologia.',
			avatarUrl: '/placeholder.svg?height=300&width=300',
		},
		create: {
			email: 'john@example.com',
			name: 'John Doe',
			role: 'admin',
			password: await hash('senha123'),
			bio: 'Escritor, desenvolvedor e entusiasta de tecnologia com mais de 10 anos de experiência no setor de tecnologia.',
			avatarUrl: '/placeholder.svg?height=300&width=300',
		},
	});

	// Create categories
	const technologyCategory = await prisma.category.upsert({
		where: { slug: 'technology' },
		update: {},
		create: {
			name: 'Tecnologia',
			slug: 'technology',
			description: 'Artigos sobre as últimas tendências e inovações em tecnologia',
		},
	});

	const codingCategory = await prisma.category.upsert({
		where: { slug: 'coding' },
		update: {},
		create: {
			name: 'Programação',
			slug: 'coding',
			description: 'Tutoriais de programação, dicas e melhores práticas',
		},
	});

	const personalCategory = await prisma.category.upsert({
		where: { slug: 'personal' },
		update: {},
		create: {
			name: 'Pessoal',
			slug: 'personal',
			description: 'Pensamentos pessoais, experiências e reflexões',
		},
	});

	const travelCategory = await prisma.category.upsert({
		where: { slug: 'travel' },
		update: {},
		create: {
			name: 'Viagem',
			slug: 'travel',
			description: 'Aventuras de viagem, dicas e guias de destinos',
		},
	});

	const lifestyleCategory = await prisma.category.upsert({
		where: { slug: 'lifestyle' },
		update: {},
		create: {
			name: 'Estilo de Vida',
			slug: 'lifestyle',
			description: 'Artigos sobre saúde, bem-estar e vida equilibrada',
		},
	});

	// Create tags
	const nextjsTag = await prisma.tag.upsert({
		where: { slug: 'nextjs' },
		update: {},
		create: {
			name: 'nextjs',
			slug: 'nextjs',
		},
	});

	const typescriptTag = await prisma.tag.upsert({
		where: { slug: 'typescript' },
		update: {},
		create: {
			name: 'typescript',
			slug: 'typescript',
		},
	});

	const javascriptTag = await prisma.tag.upsert({
		where: { slug: 'javascript' },
		update: {},
		create: {
			name: 'javascript',
			slug: 'javascript',
		},
	});

	const webdevTag = await prisma.tag.upsert({
		where: { slug: 'webdev' },
		update: {},
		create: {
			name: 'webdev',
			slug: 'webdev',
		},
	});

	const reactTag = await prisma.tag.upsert({
		where: { slug: 'react' },
		update: {},
		create: {
			name: 'react',
			slug: 'react',
		},
	});

	const hikingTag = await prisma.tag.upsert({
		where: { slug: 'hiking' },
		update: {},
		create: {
			name: 'hiking',
			slug: 'hiking',
		},
	});

	const natureTag = await prisma.tag.upsert({
		where: { slug: 'nature' },
		update: {},
		create: {
			name: 'nature',
			slug: 'nature',
		},
	});

	const adventureTag = await prisma.tag.upsert({
		where: { slug: 'adventure' },
		update: {},
		create: {
			name: 'adventure',
			slug: 'adventure',
		},
	});

	const productivityTag = await prisma.tag.upsert({
		where: { slug: 'productivity' },
		update: {},
		create: {
			name: 'productivity',
			slug: 'productivity',
		},
	});

	const toolsTag = await prisma.tag.upsert({
		where: { slug: 'tools' },
		update: {},
		create: {
			name: 'tools',
			slug: 'tools',
		},
	});

	// Create posts
	const nextjsPost = await prisma.post.upsert({
		where: { slug: 'getting-started-with-nextjs' },
		update: {},
		create: {
			title: 'Getting Started with Next.js: A Comprehensive Guide',
			slug: 'getting-started-with-nextjs',
			excerpt: 'Learn how to build modern web applications with Next.js, the React framework for production.',
			content: `<p>Next.js is a powerful React framework that makes building web applications easier and more efficient. In this guide, we will explore the key features of Next.js and how to get started with your first project.</p><h2>Why Next.js?</h2><p>Next.js provides several benefits over a standard React application:</p><ul><li>Server-side rendering for improved performance and SEO</li><li>Automatic code splitting for faster page loads</li><li>Simple client-side routing</li><li>API routes to build your API alongside your app</li><li>Built-in CSS and Sass support</li></ul><h2>Setting Up Your First Project</h2><p>To create a new Next.js app, run the following command:</p><pre><code>npx create-next-app my-next-app</code></pre><p>This will set up a new Next.js project with all the necessary dependencies and a basic project structure.</p><h2>Key Concepts</h2><p>Understanding these core concepts will help you make the most of Next.js:</p><h3>Pages</h3><p>In Next.js, a page is a React Component exported from a file in the pages directory. Each page is associated with a route based on its file name.</p><h3>Data Fetching</h3><p>Next.js provides several ways to fetch data for your pages:</p><ul><li>getStaticProps: Fetch data at build time</li><li>getServerSideProps: Fetch data on each request</li><li>getStaticPaths: Specify dynamic routes to pre-render</li></ul><h3>API Routes</h3><p>Next.js allows you to create API endpoints as Node.js serverless functions by creating files in the pages/api directory.</p><h2>Conclusion</h2><p>Next.js is a versatile framework that simplifies React development while providing powerful features. By understanding its core concepts, you can build fast, SEO-friendly applications with a great developer experience.</p>`,
			coverImage: '/placeholder.svg?height=600&width=1200',
			readingTime: 5,
			published: true,
			featured: true,
			authorId: user.id,
			publishedAt: new Date(),
		},
	});

	const typescriptPost = await prisma.post.upsert({
		where: { slug: 'mastering-typescript' },
		update: {},
		create: {
			title: 'Mastering TypeScript: Tips and Tricks',
			slug: 'mastering-typescript',
			excerpt: 'Improve your TypeScript skills with these advanced tips and tricks for better type safety.',
			content: `<p>TypeScript has become an essential tool for modern JavaScript development. This post will share some advanced techniques to help you get the most out of TypeScript in your projects.</p><h2>Utility Types</h2><p>TypeScript provides several utility types that can help you transform existing types:</p><pre><code>// Pick specific properties from a type
type User = { id: number; name: string; email: string; }
type UserCredentials = Pick<User, "email" | "id">

// Make all properties optional
type PartialUser = Partial<User>

// Make all properties required
type RequiredUser = Required<User>

// Make all properties readonly
type ReadonlyUser = Readonly<User></code></pre><h2>Type Guards</h2><p>Type guards help you narrow down the type of a variable within a conditional block:</p><pre><code>function isString(value: unknown): value is string {
  return typeof value === "string"
}

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is a string here
    console.log(value.toUpperCase())
  }
}</code></pre><h2>Mapped Types</h2><p>Mapped types allow you to create new types by transforming properties of existing ones:</p><pre><code>type Nullable<T> = { [P in keyof T]: T[P] | null }

// Now all properties can be null
const user: Nullable<User> = {
  id: 1,
  name: null,
  email: "user@example.com"
}</code></pre><h2>Template Literal Types</h2><p>TypeScript 4.1 introduced template literal types, which allow you to create types based on string literals:</p><pre><code>type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
type Endpoint = "/users" | "/posts" | "/comments"

// Combines both types
type ApiRoute = \`\${HttpMethod} \${Endpoint}\`
// Results in: "GET /users" | "GET /posts" | etc.</code></pre><h2>Conclusion</h2><p>These advanced TypeScript features can help you write more type-safe code with less boilerplate. By leveraging the type system effectively, you can catch errors at compile time rather than runtime, leading to more robust applications.</p>`,
			coverImage: '/placeholder.svg?height=600&width=1200',
			readingTime: 8,
			published: true,
			featured: false,
			authorId: user.id,
			publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
		},
	});

	const hikingPost = await prisma.post.upsert({
		where: { slug: 'hiking-in-the-mountains' },
		update: {},
		create: {
			title: 'My Weekend Hiking Adventure in the Mountains',
			slug: 'hiking-in-the-mountains',
			excerpt: 'A personal account of my recent hiking trip and the beautiful landscapes I encountered.',
			content: `<p>Last weekend, I decided to disconnect from technology and reconnect with nature by going on a hiking trip to the mountains. The experience was both challenging and rewarding, and I wanted to share some highlights from my adventure.</p><h2>Preparing for the Trip</h2><p>Preparation is key for any hiking trip. Here's what I packed:</p><ul><li>A comfortable backpack with proper weight distribution</li><li>Plenty of water and high-energy snacks</li><li>Layered clothing for changing weather conditions</li><li>A first aid kit and emergency supplies</li><li>A detailed map and compass (even though I had GPS)</li></ul><h2>The Trail</h2><p>I chose a moderate 8-mile trail that offered stunning views of the valley below. The path started in a dense forest and gradually ascended to an open ridge with panoramic vistas.</p><p>The first two miles were relatively easy, with a gentle incline through pine trees that provided welcome shade. As I climbed higher, the vegetation changed, and the trail became steeper and more challenging.</p><h2>The Summit</h2><p>Reaching the summit after three hours of hiking was an incredible feeling. The 360-degree views were breathtaking—mountains stretching to the horizon, a crystal-clear lake in the distance, and tiny villages dotting the valley floor.</p><p>I spent about an hour at the top, enjoying a well-deserved lunch while soaking in the scenery. The silence was occasionally broken by the call of a hawk circling overhead.</p><h2>Lessons Learned</h2><p>This hiking trip reminded me of several important life lessons:</p><ol><li>The journey is as important as the destination</li><li>Challenges make the reward more satisfying</li><li>Nature has a way of putting things in perspective</li><li>Sometimes, disconnecting is the best way to reconnect with yourself</li></ol><h2>Conclusion</h2><p>If you're feeling overwhelmed by the constant demands of modern life, I highly recommend taking a day to explore a nearby trail. The physical exercise, fresh air, and natural beauty can do wonders for your mental and physical well-being.</p><p>I'm already planning my next hiking adventure, and I can't wait to discover more hidden gems in the mountains.</p>`,
			coverImage: '/placeholder.svg?height=600&width=1200',
			readingTime: 6,
			published: true,
			featured: false,
			authorId: user.id,
			publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
		},
	});

	const tailwindPost = await prisma.post.upsert({
		where: { slug: 'tailwind-css-tricks' },
		update: {},
		create: {
			title: '10 Tailwind CSS Tricks to Improve Your Workflow',
			slug: 'tailwind-css-tricks',
			excerpt:
				'Discover powerful Tailwind CSS techniques that will make your development process faster and more efficient.',
			content: `<p>Tailwind CSS has revolutionized the way many developers approach styling their web applications. Here are 10 tricks that will help you get the most out of this utility-first CSS framework.</p><h2>1. Use the JIT Mode</h2><p>Tailwind's Just-in-Time mode generates styles on-demand, resulting in smaller CSS files and allowing you to use arbitrary values:</p><pre><code>// Use any value, not just those predefined
&lt;div class="top-[117px]"&gt;&lt;/div&gt;</code></pre><h2>2. Create Component Classes with @apply</h2><p>When you find yourself repeating the same set of utilities, use @apply to create reusable component classes:</p><pre><code>@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
  }
}</code></pre><h2>3. Customize Your Theme</h2><p>Extend Tailwind's default theme to include your project's specific design tokens:</p><pre><code>// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#f7fafc",
          DEFAULT: "#1a202c",
          dark: "#0d1219",
        },
      },
    },
  },
}</code></pre><h2>4. Use Variants for Responsive Design</h2><p>Tailwind makes responsive design simple with built-in breakpoint variants:</p><pre><code>&lt;div class="text-sm md:text-base lg:text-lg"&gt;
  This text changes size at different breakpoints
&lt;/div&gt;</code></pre><h2>5. Group Hover States</h2><p>Use group-hover to change styles of child elements when a parent is hovered:</p><pre><code>&lt;div class="group"&gt;
  &lt;h3&gt;Title&lt;/h3&gt;
  &lt;p class="hidden group-hover:block"&gt;
    This text only appears when the div is hovered
  &lt;/p&gt;
&lt;/div&gt;</code></pre><h2>6. Create Dark Mode Variants</h2><p>Implement dark mode with Tailwind's dark variant:</p><pre><code>&lt;div class="bg-white text-black dark:bg-gray-800 dark:text-white"&gt;
  This div changes colors in dark mode
&lt;/div&gt;</code></pre><h2>7. Use Plugins to Extend Functionality</h2><p>Tailwind plugins can add new utilities, components, or variants:</p><pre><code>// tailwind.config.js
const plugin = require("tailwindcss/plugin")

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-sm": {
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.25)",
        },
        ".text-shadow": {
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
        },
      }
      addUtilities(newUtilities)
    }),
  ],
}</code></pre><h2>8. Optimize for Production</h2><p>Ensure you're purging unused styles in production:</p><pre><code>// tailwind.config.js
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  // ...
}</code></pre><h2>9. Use Arbitrary Properties</h2><p>For one-off styles that don't fit into Tailwind's utility classes:</p><pre><code>&lt;div class="[mask-type:luminance]"&gt;
  Custom property
&lt;/div&gt;</code></pre><h2>10. Combine with CSS Variables</h2><p>Use CSS variables for dynamic theming:</p><pre><code>:root {
  --color-primary: #3490dc;
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
      },
    },
  },
}</code></pre><h2>Conclusion</h2><p>These Tailwind CSS tricks will help you write more maintainable and efficient CSS while speeding up your development workflow. As you become more comfortable with Tailwind, you'll discover even more ways to leverage its powerful features.</p>`,
			coverImage: '/placeholder.svg?height=600&width=1200',
			readingTime: 7,
			published: true,
			featured: false,
			authorId: user.id,
			publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
		},
	});

	const productivityPost = await prisma.post.upsert({
		where: { slug: 'productivity-tools' },
		update: {},
		create: {
			title: '5 Productivity Tools I Cannot Live Without',
			slug: 'productivity-tools',
			excerpt: 'These are the essential tools that have significantly improved my productivity as a developer.',
			content: `<p>As a developer, having the right tools can make a huge difference in your productivity and workflow. Here are five tools that have become essential in my daily work.</p><h2>1. VS Code</h2><p>Visual Studio Code has become my editor of choice for several reasons:</p><ul><li>Extensive extension ecosystem</li><li>Integrated terminal</li><li>Git integration</li><li>IntelliSense code completion</li><li>Customizable interface</li></ul><p>My favorite extensions include Prettier for code formatting, ESLint for linting, and GitLens for enhanced Git capabilities.</p><h2>2. Alfred</h2><p>Alfred is a productivity app for macOS that replaces the default Spotlight search. It allows me to:</p><ul><li>Launch applications quickly</li><li>Find files instantly</li><li>Execute custom workflows</li><li>Use clipboard history</li><li>Perform calculations and conversions</li></ul><p>The ability to create custom workflows has saved me countless hours on repetitive tasks.</p><h2>3. Notion</h2><p>Notion has replaced several apps in my workflow, serving as my:</p><ul><li>Note-taking app</li><li>Project management tool</li><li>Documentation hub</li><li>Knowledge base</li><li>Reading list manager</li></ul><p>Its flexibility allows me to structure information in a way that makes sense for different projects and contexts.</p><h2>4. Rectangle</h2><p>Rectangle is a window management tool for macOS that allows me to:</p><ul><li>Resize windows with keyboard shortcuts</li><li>Snap windows to different parts of the screen</li><li>Create custom layouts</li><li>Move windows between displays</li></ul><p>This tool is particularly useful when working with multiple applications simultaneously.</p><h2>5. Raycast</h2><p>Raycast is a newer addition to my toolkit, but it's quickly becoming indispensable. It's a blazing-fast launcher that allows me to:</p><ul><li>Control my system</li><li>Connect to APIs</li><li>Script custom commands</li><li>Manage clipboard history</li><li>Search documentation</li></ul><p>The developer-focused features, like the ability to quickly search documentation or manage GitHub issues, have been particularly helpful.</p><h2>Conclusion</h2><p>Finding the right tools takes time and experimentation, but the productivity gains are worth the effort. These five tools have significantly improved my workflow, allowing me to focus more on creative problem-solving and less on repetitive tasks.</p><p>What productivity tools do you rely on? I'm always looking to optimize my workflow further, so I'd love to hear your recommendations!</p>`,
			coverImage: '/placeholder.svg?height=600&width=1200',
			readingTime: 4,
			published: true,
			featured: false,
			authorId: user.id,
			publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
		},
	});

	// Connect posts to categories
	await prisma.postCategory.createMany({
		data: [
			{ postId: nextjsPost.id, categoryId: technologyCategory.id },
			{ postId: nextjsPost.id, categoryId: codingCategory.id },
			{ postId: typescriptPost.id, categoryId: codingCategory.id },
			{ postId: hikingPost.id, categoryId: travelCategory.id },
			{ postId: hikingPost.id, categoryId: personalCategory.id },
			{ postId: tailwindPost.id, categoryId: codingCategory.id },
			{ postId: tailwindPost.id, categoryId: technologyCategory.id },
			{ postId: productivityPost.id, categoryId: technologyCategory.id },
			{ postId: productivityPost.id, categoryId: lifestyleCategory.id },
		],
		skipDuplicates: true,
	});

	// Connect posts to tags
	await prisma.postTag.createMany({
		data: [
			{ postId: nextjsPost.id, tagId: nextjsTag.id },
			{ postId: nextjsPost.id, tagId: reactTag.id },
			{ postId: nextjsPost.id, tagId: webdevTag.id },
			{ postId: typescriptPost.id, tagId: typescriptTag.id },
			{ postId: typescriptPost.id, tagId: javascriptTag.id },
			{ postId: typescriptPost.id, tagId: webdevTag.id },
			{ postId: hikingPost.id, tagId: hikingTag.id },
			{ postId: hikingPost.id, tagId: natureTag.id },
			{ postId: hikingPost.id, tagId: adventureTag.id },
			{ postId: tailwindPost.id, tagId: webdevTag.id },
			{ postId: productivityPost.id, tagId: productivityTag.id },
			{ postId: productivityPost.id, tagId: toolsTag.id },
		],
		skipDuplicates: true,
	});

	// Add some post views
	await prisma.postView.createMany({
		data: [
			{ postId: nextjsPost.id, viewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
			{ postId: nextjsPost.id, viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
			{ postId: nextjsPost.id, viewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
			{ postId: nextjsPost.id, viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
			{ postId: nextjsPost.id, viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
			{ postId: typescriptPost.id, viewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
			{ postId: typescriptPost.id, viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
			{ postId: hikingPost.id, viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
		],
	});

	console.log('Database has been seeded!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
