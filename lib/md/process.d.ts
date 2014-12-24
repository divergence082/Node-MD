

interface WritableStream {}
interface ReadableStream {}

interface MemoryUsage {
  rss: number;
  heapTotal;
  number;
  heapUsed: number;
}

interface Versions {
  http_parser: string;
  node: string;
  v8: string;
  ares: string;
  uv: string;
  zlib: string;
  openssl: string;
}

interface TargetDefaults {
  cflags: Array<any>;
  default_configuration: string;
  defines: Array<string>;
  include_dirs: Array<string>;
  libraries: Array<string>;
}


interface Variables {
  clang: number;
  host_arch: string;
  node_install_npm: boolean;
  node_install_waf: boolean;
  node_prefix: string;
  node_shared_openssl: boolean;
  node_shared_v8: boolean;
  node_shared_zlib: boolean;
  node_use_dtrace: boolean;
  node_use_etw: boolean;
  node_use_openssl: boolean;
  target_arch: string;
  v8_no_strict_aliasing: number;
  v8_use_snapshot: boolean;
  visibility: string;
}

interface Config {
  target_defaults: TargetDefaults;
  variables: Variables;
}

declare interface process {
  stdout: WritableStream;
  stderr: WritableStream;
  stdin: ReadableStream;
  argv: Array<string>;
  execPath: string;
  env: any;
  pid: number;
  title: string;
  arch: string;
  platform: string;
  version: string;
  versions: Versions;
  config: Config;

  abort(): void;
  chdir(directory: string): void;
  cwd(): string;
  exit(code?: number): void;
  kill(pid: number, signal?: string): void;
  memoryUsage(): MemoryUsage;
  nextTick(callback: Function): void;
  umask(mask?: number): number;

  getgid(): number;
  setgid(id: number): void;
  getuid(): number;
  setuid(id: number): void;

  uptime(): number;
  hrtime(): number[];
  hrtime(start: number[]): number[];
}
