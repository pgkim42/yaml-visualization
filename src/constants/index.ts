// 타이밍 관련 상수
export const TIMING = {
  DEBOUNCE_MS: 300,
  SAVE_DELAY: 1000,
  COPY_FEEDBACK_MS: 2000,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEY = 'yaml-visualizer';

// 레이아웃 관련 상수
export const LAYOUT = {
  MIN_PANE_WIDTH: 300,
  MOBILE_BREAKPOINT: 768,
  TREE_INDENT_PX: 16,
} as const;

// 샘플 YAML
export const SAMPLE_YAML = `server:
  host: localhost
  port: 8080
  ssl:
    enabled: true
    certificate: /path/to/cert.pem

database:
  type: postgresql
  connection:
    host: db.example.com
    port: 5432
    name: myapp
  pool:
    min: 5
    max: 20

features:
  - authentication
  - logging
  - monitoring

users:
  - name: admin
    role: administrator
    active: true
  - name: guest
    role: viewer
    active: false
`;
