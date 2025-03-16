## Installation

Install dependencies:


```shellscript
npm install
# or
yarn install
```

Start the development server:


```shellscript
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Usage

### Login Credentials

Use the following test credentials to log in:

- **Email**: `user@example.com`
- **Password**: `password123`


### Creating Posts

After logging in, you'll be redirected to the dashboard where you can create posts. Each post creation request will include the CSRF token for validation.

### Viewing Logs

The application includes detailed logging to help you understand the CSRF protection process:

- **Login page**: Shows logs related to authentication and token generation
- **Dashboard**: Shows logs related to token validation and request processing


## How It Works

This application demonstrates CSRF protection using in-memory tokens instead of cookies:

1. **Token Generation**:

1. When a user logs in, the server generates a random CSRF token using the Web Crypto API
2. The token is stored in-memory on the server (associated with the user's session)
3. The token is returned to the client in the login response



2. **Client-Side Storage**:

1. The token is stored in memory (in a global variable) on the client side
2. This approach avoids using cookies, which are automatically sent with every request



3. **Protected Requests**:

1. When submitting the "Create Post" form, the client includes the CSRF token
2. The server validates the token before processing the request
3. If the token is invalid or missing, the request is rejected



4. **Security Benefits**:

1. Tokens aren't automatically sent with every request (unlike cookies)
2. The token is validated on the server for each protected action
3. This prevents malicious sites from making authenticated requests on behalf of the user





## Testing CSRF Protection

### Normal Flow (Should Work)

1. Log in with the test credentials
2. Create a post
3. Observe the logs showing successful token validation


### Test CSRF Protection (Should Fail)

1. Log in
2. Open browser console and modify the token: `window.csrfToken = "fake-token"`
3. Try to create a post
4. Observe the logs showing token validation failure


### Session Expiration (Should Fail)

1. Log in
2. Restart the server (which clears the in-memory token store)
3. Try to create a post
4. Observe the logs showing token validation failure


## Security Considerations

This demo implements basic CSRF protection, but a production application would need additional security measures:

1. **Token Expiration**: Implement token expiration and rotation
2. **Persistent Storage**: Use a database or Redis instead of in-memory storage
3. **Secure Authentication**: Implement proper user authentication with password hashing
4. **HTTPS**: Ensure all communication is over HTTPS
5. **XSS Protection**: Implement measures to prevent Cross-Site Scripting attacks


## Project Structure

```plaintext
csrf-protection-demo/
├── app/
│   ├── actions/
│   │   ├── auth.ts         # Authentication and CSRF token logic
│   │   └── posts.ts        # Protected post creation endpoint
│   ├── about/
│   │   └── page.tsx        # Information about CSRF protection
│   ├── dashboard/
│   │   └── page.tsx        # Protected dashboard with post creation
│   ├── login/
│   │   └── page.tsx        # Login page with token generation
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # UI components from shadcn/ui
│   └── theme-provider.tsx  # Theme provider
├── lib/
│   └── utils.ts            # Utility functions
├── public/
│   └── ...                 # Static assets
├── .gitignore
├── next.config.mjs
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Inspired by OWASP CSRF prevention recommendations
