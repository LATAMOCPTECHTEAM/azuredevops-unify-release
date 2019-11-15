
import { container } from "tsyringe";

container.register<Foo>(Foo, {useClass: Foo});