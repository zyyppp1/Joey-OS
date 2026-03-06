// data/blogs.ts

export type BlogPost = {
  id: string;
  filename: string;
  title: string;
  date: string;
  content: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    filename: 'python_visa_script.txt',
    title: 'How I earned £2000+ with a Python Selenium Script',
    date: '2024-05-12',
    content: `[ SYSTEM LOG: 2024-05-12 ]

When I was studying at the University of Nottingham, I noticed a huge demand for US visa interview slots. The official website was always fully booked, and students were struggling to find available dates.

As a developer, I saw an opportunity to automate this. 

I wrote a Python script using Selenium to log in, monitor the availability, and send an alert the second a slot opened up. 

What started as a tool for myself quickly became a service for others. Within two weeks, I helped multiple students secure their slots and earned over £2000. 

Key Takeaways:
1. Automation is powerful.
2. Finding real-world problems is the best way to practice coding.
3. Always respect rate limits (I learned this the hard way!).`
  },
  {
    id: '2',
    filename: 'golang_vs_node.txt',
    title: 'Migrating microservices from Node.js to Go',
    date: '2025-08-20',
    content: `[ SYSTEM LOG: 2025-08-20 ]

At SpinnrTech, we faced a bottleneck with our order tracking API written in Node.js. Under high concurrency, the event loop struggled with CPU-intensive data transformations.

I led the initiative to rewrite this specific microservice in Go.

Results:
- Memory footprint reduced by 60%.
- Response time dropped from 120ms to 15ms.
- Concurrency handled gracefully with Goroutines.

Node.js is still my go-to for I/O heavy, rapid prototyping, but Go's performance in CPU-bound microservices is unmatched.`
  }
];