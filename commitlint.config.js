// Conventional commits (`feat: …`, `fix(scope): …`), read by the commit lint workflow: release-please needs them.
export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // GitHub shortens long titles, but a strict 100 rejected ordinary messages; the body wraps freely.
        'header-max-length': [2, 'always', 120],
        'body-max-line-length': [0],
        'footer-max-line-length': [0]
    }
};
