use tracing_subscriber::fmt::format::FmtSpan;
use warp::Filter;

#[tokio::main]
async fn main() {
    let filter = std::env::var("RUST_LOG").unwrap_or_else(|_| "tracing=info,warp=debug".to_owned());
    tracing_subscriber::fmt()
        .with_env_filter(filter)
        .with_span_events(FmtSpan::CLOSE)
        .init();

    let static_dir = warp::path("assets").and(warp::fs::dir("dist/assets"));
    let index = warp::path::end().and(warp::fs::file("dist/index.html"));
    let routes = index.or(static_dir).with(warp::trace::request());

    println!("Starting Server...");
    warp::serve(routes).run(([127, 0, 0, 1], 3000)).await;
}
